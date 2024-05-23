import {TelegrafContext} from 'telegraf/typings/context';

import dotenv from 'dotenv';
import fs from 'fs';
import Telegraf, {Telegram} from 'telegraf';
import {createConnection} from 'typeorm';
import {Chat} from './app/database/entities/Chat';
import {ChatState} from './app/database/entities/ChatState';
import {ChatPlatforms} from './app/database/entities/ChatPlatforms';
import session from 'telegraf/session';
import Stage from 'telegraf/stage';
import FeedbackScene from './app/menu/feedbackScene';
import Middlewares from './app/menu/middlewares';
import handleMessage from './app/helpers/songHandler';
import {Logger} from "tslog";
import NotifyScene from "./app/menu/notifyScene";
import {TOptions} from "telegraf/typings/telegraf";
import {handleInlineQuery} from "./app/middlewares/inlineQueryMiddleware";

dotenv.config()
const globalObject: any = global;

globalObject.inlineCounter = {id: 0, time: 0};

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
    entities: [Chat, ChatState, ChatPlatforms], // TODO
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
bot.command('count', Middlewares.sendUsersCount);

bot.action('contacts', Middlewares.startContactsScene);
bot.action('platforms', Middlewares.getPlatforms);
bot.action('settings', Middlewares.getSettings);
bot.action('help', Middlewares.getHelp);
bot.action(/helpOption:[0-9]/, Middlewares.getHelpOption);
bot.action(/platform:[\w]+/, Middlewares.getPlatformOption);
bot.action(/state:[\w]+/, Middlewares.getStateOption);
bot.action('back', Middlewares.getBack);
bot.action('close', Middlewares.getClose);

bot.action('notify', Middlewares.startNotifyScene);

bot.catch((err: any) => {
    const chatId = err.on?.payload?.chat_id ?? null;

    globalObject.loger.error('Unhandled error', { code: err.code, description: err.description, method: err.on.method });

    if (chatId) {
        return bot.telegram.sendMessage(err.on.payload.chat_id, 'Неизвестная ошибка');
    }
});

bot.on(['message', 'channel_post'], ctx => {
    bot.telegram.sendMessage(process.env.OWNER_ID, `Type: ${ctx.updateType}, User: ${ctx.chat.id}`)
    return handleMessage(ctx);
});
bot.on('inline_query', handleInlineQuery);

// process.env.NODE_ENV === 'production' ? startHooksMode(bot) : startPollingMode(bot);

startPollingMode(bot);

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
