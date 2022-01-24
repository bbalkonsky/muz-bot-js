import {TelegrafContext} from 'telegraf/typings/context';

import dotenv from 'dotenv';
import fs from 'fs';
import Telegraf, {Markup, Telegram} from 'telegraf';
import {createConnection} from 'typeorm';
import {Chat} from './app/database/entities/Chat';
import {ChatState} from './app/database/entities/ChatState';
import {ChatPlatforms} from './app/database/entities/ChatPlatforms';
import {Messages} from './app/database/entities/Messages';
import session from 'telegraf/session';
import Stage from 'telegraf/stage';
import FeedbackScene from './app/menu/feedbackScene';
import Middlewares from './app/menu/middlewares';
import SongHandler, {getSongLinksButtons, getSongName, getSongThumb, replaceUnderline} from './app/helpers/songHandler';

dotenv.config()
import { Logger } from "tslog";
import NotifyScene from "./app/menu/notifyScene";
import {TOptions} from "telegraf/typings/telegraf";
import axios from "axios";
import {InlineQueryResult} from "telegraf/typings/telegram-types";
import Buttons from "./app/menu/buttons";
import DataBaseController from "./app/database/controllers";
const globalObject: any = global;

const logger = new Logger({displayDateTime: false, displayFilePath: 'hidden', displayFunctionName: false});
globalObject.loger = logger;

export const bot = new Telegraf(
    process.env.TELEGRAM_TOKEN,
    {
        username: process.env.BOT_USERNAME,
        channelMode: true,
    } as TOptions
);

createConnection({
    type: 'sqlite',
    database: process.env.DBASE_PATH,
    entities: [Chat, ChatState, ChatPlatforms, Messages], // TODO
    synchronize: true
})
    .then()
    .catch(() => {
        globalObject.loger.fatal('Cannot establish connection with database');
    });

// Create scene manager
const feedbackScene = new FeedbackScene();
const notifyScene = new NotifyScene();
const stage = new Stage([feedbackScene.getScene(), notifyScene.getScene()])

bot.use(session());
session.messageToDelete = {};

bot.use(stage.middleware());

bot.command('start', Middlewares.startMdlwr);
bot.command('menu', Middlewares.getMainMenu);

bot.command('version', Middlewares.sendBotVersion);

bot.action('contacts', Middlewares.startContactsScene);
bot.action('platforms', Middlewares.getPlatforms);
bot.action('settings', Middlewares.getSettings);
bot.action('donate', Middlewares.getDonations);
bot.action('help', Middlewares.getHelp);
bot.action(/helpOption:[0-9]/, Middlewares.getHelpOption);
bot.action(/platform:[\w]+/, Middlewares.getPlatformOption);
bot.action(/state:[\w]+/, Middlewares.getStateOption);
bot.action('back', Middlewares.getBack);
bot.action('close', Middlewares.getClose);

bot.action('notify', Middlewares.startNotifyScene);

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    const urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);

    const query = inlineQuery.query;
    if (!query) return;

    if (query.match(urlRegex)) {
        const options = {
            key: process.env.ODESLI_TOKEN,
            url: encodeURIComponent(query)
        };

        return axios.get(process.env.ODESLI_API_URL, {params: options})
            .then(async (res) => {
                const chatPlatforms = await DataBaseController.getChatPlatforms(inlineQuery.from.id);
                const songName = getSongName(res.data);
                const songThumb = getSongThumb(res.data);
                const buttons = getSongLinksButtons(res.data, chatPlatforms, songName);

                if (!buttons.length) {
                    return;
                }

                const title = replaceUnderline(songName.title);
                const artist = replaceUnderline(songName.artist);
                const replyText = `*${title}*\n${artist}[\u200B](${songThumb})`;

                const response = res.data;
                const firstEntity = response.entitiesByUniqueId[response.entityUniqueId];
                return answerInlineQuery([{
                    id: firstEntity.id,
                    type: 'article',
                    thumb_url: firstEntity.thumbnailUrl,
                    title: firstEntity.title,
                    description: firstEntity.artistName,
                    url: response.linksByPlatform[firstEntity.apiProvider].url,
                    hide_url: true,
                    reply_markup: Markup.inlineKeyboard(buttons),
                    input_message_content: {
                        message_text: replyText,
                        parse_mode: 'MarkdownV2'
                    }
                }]);
            })
            .catch((err) => {
                console.log(err.response?.status);
            });
    } else {
        const options = {
            term: query,
            entity: 'song,album,podcast'
        };

        return axios.get('https://itunes.apple.com/search', {params: options})
            .then((res) => {
                if (res.data.resultCount) {
                    const results = res.data.results.slice(0, 5);
                    const answers: InlineQueryResult[] = results.map(x => {
                        return {
                            id: `${x.artistId}${x.collectionId}${x.trackId}`,
                            type: 'article',
                            thumb_url: x.artworkUrl100,
                            title: x.wrapperType === 'track' ? `${x.trackName} - ${x.artistName}` : x.artistName,
                            description: x.collectionName,
                            url: x.trackViewUrl ? x.trackViewUrl : x.collectionViewUrl,
                            hide_url: true,
                            input_message_content: {
                                message_text: x.trackViewUrl ? x.trackViewUrl : x.collectionViewUrl
                            }
                        }
                    })

                    return answerInlineQuery(answers)
                }
            })
            .catch((err) => {
                console.log(err.response?.status);
            });
    }
});

bot.catch((err: any) => {
    // TODO
    globalObject.loger.fatal(err);
    bot.telegram.sendMessage(err.on.payload.chat_id, 'Что-то пошло не так 😐').then();
});

bot.on(['message', 'channel_post'], ctx => SongHandler.handleMessage(ctx));

process.env.NODE_ENV === 'production' ? startHooksMode(bot) : startPollingMode(bot);

function startPollingMode(tgbot: Telegraf<TelegrafContext>) {
    globalObject.loger.debug('Starting a bot in develop mode');
    tgbot.startPolling();
}

async function startHooksMode(tgbot: Telegraf<TelegrafContext>) {
    globalObject.loger.debug('Starting a bot in production mode');
    const telegram = new Telegram(process.env.TELEGRAM_TOKEN, {});

    await telegram.deleteWebhook();

    const tlsOptions = {
        key: fs.readFileSync(process.env.PATH_TO_KEY),
        cert: fs.readFileSync(process.env.PATH_TO_CERT)
    };

    await tgbot.telegram.setWebhook(
        `${process.env.WEBHOOK_URL}:${process.env.WEBHOOK_PORT}/${process.env.TELEGRAM_TOKEN}`,
        {
            source: 'cert.pem'
        }
    );

    await tgbot.startWebhook(`/${process.env.TELEGRAM_TOKEN}`, tlsOptions, +process.env.WEBHOOK_PORT);

    const webhookStatus = await telegram.getWebhookInfo();
    globalObject.loger.debug('Webhook status', webhookStatus);
}
