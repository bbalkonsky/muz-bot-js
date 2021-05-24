import Info from './info';
import axios from 'axios';
import {UrlButton} from 'telegraf/typings/markup';
import {Markup} from 'telegraf';
import {ChatPlatforms} from '../database/entities/ChatPlatforms';
import {User} from 'telegraf/typings/telegram-types';
import DataBaseController from '../database/controllers';
import Middlewares from '../menu/middlewares';
import {Song} from '../models/song';
import {TelegrafContext} from 'telegraf/typings/context';
import {bot} from '../../app';
import Helpers from "./helpers";
const globalObject: any = global;

export default class SongHandler {
  public static async handleMessage(ctx: TelegrafContext) {
    const message = ctx.updateType === 'message' ?
            ctx.message :
            ctx.updateType === 'channel_post' ?
                ctx.channelPost :
                null;
    if (!message?.entities) return;
    const parsedMessage = SongHandler.getParsedMessage(message);

    if (parsedMessage) {
      let loadingMessageId: number;
      ctx.replyWithSticker('CgACAgQAAxkBAAIOUGCrZ9K7IOnWXkJGbgqF2eHOaBtkAAJCAgACeOiUUh4Te5TPLkixHwQ')
          .then((mes) => {
            loadingMessageId = mes.message_id;
          })
          .catch((err) => {
            globalObject.loger.error('Не смог отправить гифку');
          });

      const chatId = ctx.chat.id;

      await Middlewares.getOrCreateChat(ctx);
      if (!Helpers.isAdmin(ctx.chat.id)) {
        globalObject.loger.info('message', JSON.stringify({
          chatId,
          chatType: ctx.chat.type,
        }));
      }

      const chatPlatforms = await DataBaseController.getChatPlatforms(chatId);
      const songInfo = await SongHandler.getSongInfoOrReplyError(parsedMessage.url, ctx);

      if (songInfo) {
        const songName = SongHandler.getSongName(songInfo);
        const songThumb = SongHandler.getSongThumb(songInfo);
        const buttons = SongHandler.getSongLinksButtons(songInfo, chatPlatforms, songName);

        if (!buttons.length) {
          await ctx.reply('Выбранных тобой платформ в найденном нет 🙃');
          return;
        }

        const chatState = await DataBaseController.getChatState(chatId);
        const chatAnnotations = chatState.annotations ? parsedMessage.description : null;

        const signature = SongHandler.sentBy(ctx.from, ctx.chat.type);
        const replyText = SongHandler.prepareReplyText(songName, songThumb, signature, chatAnnotations);

        await ctx.deleteMessage()
            .then()
            .catch(() => {
              ctx.reply('Я, кстати, могу удалять оригинальное сообщение, ' +
                            'но для этого мне нужно дать права на удаление чужих сообщений ' +
                            '(это в настройках администраторов)');
            });
        if (loadingMessageId) {
          await bot.telegram.deleteMessage(ctx.chat.id, loadingMessageId);
        }
        await ctx.replyWithMarkdown(replyText, Markup.inlineKeyboard(buttons).extra());
      }
    }
  }

  private static getParsedMessage(message: any): {
        url: string,
        description: string,
        platform: string
    } {
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

  private static getSongInfoOrReplyError(url: string, ctx: TelegrafContext): any {
    const options = {
      url,
      key: process.env.ODESLI_TOKEN,
    };

    return axios.get(process.env.ODESLI_API_URL, {params: options})
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status) {
            ctx.reply('Ничего не нашел 😐').then();
          } else {
            ctx.reply('Что-то пошло не так').then();
          }
        });
  }

  // TODO переписать когда обновится api
  private static getSongName(response: Song): {title: string, artist: string} {
    const entity = response.entitiesByUniqueId[response.entityUniqueId];
    return {title: entity.title, artist: entity.artistName};
  }

  // TODO переписать когда обновится api
  private static getSongThumb(response: Song): string {
    return response.entitiesByUniqueId[response.entityUniqueId].thumbnailUrl;
  }

  // TODO очень много входных параметров
  private static getSongLinksButtons(
      response: Song,
      chatPlatforms: ChatPlatforms,
      songName: {title: string, artist: string},
  ): UrlButton[][] {
    const buttons = [];
    let tempArray = [];
    let counter = 1;
    const colsNumber = 3;
    const linksByPlatform = response.linksByPlatform;
    if (chatPlatforms.vk) {
      const songFullName = `${songName.artist} - ${songName.title}`;
      linksByPlatform.vk = {url: SongHandler.getVkLink(songFullName)};
    }
    const keys = Object.keys(response.linksByPlatform);
    keys.forEach((key) => {
      if (chatPlatforms[key]) {
        const newButton = Markup.urlButton(
            `${Info.platforms[key].alias}`,
            `${response.linksByPlatform[key].url}`,
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
    if (tempArray.length) buttons.push(tempArray);
    return buttons;
  }

  // TODO надо бы отрефакторить
  private static getVkLink(songName: string): string {
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

  private static sentBy(message: User, chatType: string): string {
    switch (chatType) {
      case 'private':
        return '';
      case 'channel':
        return `\n—\nvia @muzsharebot`;
      default:
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

  // TODO очень много входных параметров
  private static prepareReplyText(songName, songThumb, signature, chatAnnotations?: string) {
    const annotations = chatAnnotations?.length ? `\n—\n${chatAnnotations}` : '';
    const title = SongHandler.replaceUnderline(songName.title);
    const artist = SongHandler.replaceUnderline(songName.artist);

    return `*${title}*\n${artist}[\u200B](${songThumb})${annotations}${signature}`;
  }

  private static replaceUnderline(toReplace: string): string {
    return toReplace.replace('_', '\\_');
  }
}
