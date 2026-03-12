import Info from './info';
import {UrlButton} from 'telegraf/typings/markup';
import {Markup} from 'telegraf';
import {ChatPlatforms} from '../database/entities/ChatPlatforms';
import {User} from 'telegraf/typings/telegram-types';
import DataBaseController from '../database/controllers';
import Middlewares from '../menu/middlewares';
import {TelegrafContext} from 'telegraf/typings/context';
import Helpers from "./helpers";
import { getDonateButtons } from "../menu/buttons";
import {resolve} from "../lib/index";

const handleMessage = async (ctx: TelegrafContext) => {
  const message = ctx.updateType === 'message' ?
          ctx.message :
          ctx.updateType === 'channel_post' ?
              ctx.channelPost :
              null;
  if (!message?.entities) return;
  const parsedMessage = getParsedMessage(message);

  if (parsedMessage) {
    // let loadingMessageId: number;
    // ctx.replyWithDocument('CgACAgQAAxkBAAIOUGCrZ9K7IOnWXkJGbgqF2eHOaBtkAAJCAgACeOiUUh4Te5TPLkixHwQ')
    //     .then((mes) => {
    //       loadingMessageId = mes.message_id;
    //     })
    //     .catch((err) => {
    //       globalObject.loger.error('Не смог отправить гифку');
    //     });

    const chatId = ctx.chat.id;

    await Middlewares.getOrCreateChat(chatId, ctx.chat.type);

    if (ctx.chat.type !== 'private') {
      const chatState = await DataBaseController.getChatState(chatId);
      if (!chatState.authorMode) {
        return;
      }
    }

    if (!Helpers.isAdmin(chatId)) {
      console.log(
          JSON.stringify({
            messageType: 'message',
            chatId,
            chatType: ctx.chat.type,
          })
      );
    }

    const chatPlatforms = await DataBaseController.getChatPlatforms(chatId);
    const songInfo = await getSongInfoOrReplyError(parsedMessage.url, ctx);

    if (songInfo) {
      const songName = getSongName(songInfo);
      const songThumb = getSongThumb(songInfo);
      const buttons = getSongLinksButtons(songInfo, chatPlatforms, songName);

      if (!buttons.length) {
        await ctx.reply('Выбранных тобой платформ в найденном нет 🙃');
        return;
      }

      const chatState = await DataBaseController.getChatState(chatId);
      const chatAnnotations = chatState.annotations ? parsedMessage.description : null;

      const signature = sentBy(ctx.from, ctx.chat.type);
      const replyText = prepareReplyText(songName, songThumb, signature, chatAnnotations);

      await ctx.deleteMessage()
          .then()
          .catch(() => {
            ctx.reply('Я, кстати, могу удалять оригинальное сообщение, ' +
                          'но для этого мне нужно дать права на удаление чужих сообщений ' +
                          '(это в настройках администраторов)');
          });
      // if (loadingMessageId) {
      //   await bot.telegram.deleteMessage(ctx.chat.id, loadingMessageId);
      // }
      await ctx.replyWithMarkdown(replyText, Markup.inlineKeyboard(buttons).extra());

      if (ctx.chat?.type && ctx.chat.type === 'private' && Math.random() > 0.8) {
        const language = ctx.from?.language_code ?? 'ru';

        setTimeout(async () => {
          await ctx.replyWithMarkdown(
              `${language === 'ru'
                  ? '⭐ Кстати говоря, ты можешь поблагодарить создателя Бота за возможность удобно делиться музыкой ⭐️'
                  : '⭐ By the way, you can support the creator of the Bot for the convenient sharing of music ⭐️'}`,
              Markup.inlineKeyboard(getDonateButtons(ctx.from?.language_code ?? 'ru', false)).extra(),
          )
        }, 1000)
      };
    }
  }
}

const getParsedMessage = (message: any): {
  url: string,
      description: string,
      platform: string
} => {
  const firstEntity = message.entities[0];
  if (firstEntity.type === 'url') {
    const link = message.text.slice(firstEntity.offset, firstEntity.offset + firstEntity.length);
    for (const [key, value] of Object.entries(Info.platforms)) {
      if (value.link.some((l) => link.includes(l))) {
        const prefix = message.text.slice(0, firstEntity.offset).trim() ?? '';
        const suffix = message.text.slice(firstEntity.offset + firstEntity.length).trim() ?? '';
        return {
          url: link,
          description: `${prefix}${prefix && suffix ? '\n' : ''}${suffix}`,
          platform: key,
        };
      }
    }
    return null;
  }
}

const getSongInfoOrReplyError = async (url: string, ctx: TelegrafContext): Promise<any> => {
  try {
    return await resolve(url);
  } catch (err) {
    if (err.status) {
      ctx.reply('Ничего не нашел 😐').then();
    } else {
        console.error(err);
      ctx.reply('Что-то пошло не так').then();
    }
    return null;
  }
}

// TODO
const getSongName = (response: any): {title: string, artist: string} => {
  return {title: response.source.title, artist: response.source.artist};
}

// TODO
const getSongThumb = (response: any): string => {
  return response.source.coverUrl;
}

// TODO
const getSongLinksButtons =
    (response: any, chatPlatforms: ChatPlatforms, songName: {title: string, artist: string}): UrlButton[][] => {
  const buttons = [];
  let tempArray = [];
  let counter = 1;
  const colsNumber = 3;

  const linksByPlatform: Record<string, {url: string}> = {
    [response.source.platform]: {url: response.source.url},
  };
  for (const [p, data] of Object.entries(response.results) as [string, any][]) {
    if (data && !data.error) {
      linksByPlatform[p] = {url: data.url};
    }
  }

  // if (chatPlatforms.vk) {
  //   const songFullName = `${songName.artist} - ${songName.title}`;
  //   linksByPlatform.vk = {url: getVkLink(songFullName)};
  // }

  const keys = Object.keys(linksByPlatform);
  keys.forEach((key) => {
    if (chatPlatforms[key]) {
      const newButton = Markup.urlButton(
          `${Info.platforms[key].alias}`,
          `${linksByPlatform[key].url}`,
      );
      tempArray.push(newButton);
      if (counter < colsNumber) {
        counter++;
      } else {
        buttons.push(tempArray);
        tempArray = [];
        counter = 1;
      }
    }
  });
  if (tempArray.length) {
    buttons.push(tempArray);
  }

  // if (buttons.length && buttons[buttons.length - 1].length < colsNumber) {
  //   buttons[buttons.length - 1].push(Markup.callbackButton(`⭐️ Donate`, 'donateBeggin'));
  // }

  return buttons;
}

// TODO
const getVkLink = (songName: string): string => {
  const songNameWithoutSymbols =
      encodeURIComponent(songName)
          .replace(/'/g, '%27')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/_/g, '%5F')
          .replace(/!/g, '%5F')
          .replace(/~/g, '%7E')
          .replace(/\*/g, '%2A');
  return `https://vk.com/search?c%5Bper_page%5D=200&c%5Bq%5D=${songNameWithoutSymbols}&c%5Bsection%5D=audio`;
}

const sentBy = (message: User, chatType: string): string => {
  switch (chatType) {
    case 'private':
      return '';
    case 'channel':
      return `\n—\nvia @muzsharebot`;
    default: {
      let name;
      if (message.username) {
        name = `@${message.username}`;
      } else if (message.first_name && message.last_name) {
        name = `${message.first_name} ${message.last_name}`;
      } else if (message.first_name) {
        name = `${message.first_name}`;
      }
      return `\n—\nSent by [${name}](tg://user?id=${message.id})`;
    }
  }
}

// TODO
const prepareReplyText = (songName, songThumb, signature, chatAnnotations?: string) => {
  const annotations = chatAnnotations?.length ? `\n—\n${chatAnnotations}` : '';
  const title = replaceUnderline(songName.title);
  const artist = replaceUnderline(songName.artist);

  return `*${title}*\n${artist}[\u200B](${songThumb})${annotations}${signature}`;
}

const replaceUnderline = (toReplace: string): string => {
  return toReplace.replace('_', '\\_');
}

export default handleMessage;
export { getSongName, getSongThumb, getSongLinksButtons, replaceUnderline };
