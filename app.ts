import {TelegrafContext} from "telegraf/typings/context";

require('dotenv').config();
import fs from 'fs';
import {Telegraf, Telegram} from 'telegraf';
import {createConnection} from "typeorm";
import {Chat} from "./app/database/entities/Chat";
import {ChatState} from "./app/database/entities/ChatState";
import {ChatPlatforms} from "./app/database/entities/ChatPlatforms";
import {Messages} from "./app/database/entities/Messages";
import session from 'telegraf/session';
import Stage from 'telegraf/stage';
import SendingScene from "./app/menu/sendScene";
import Middlewares from "./app/menu/middlewares";
import SongHandler from "./app/helpers/scripts";

export const bot = new Telegraf(
    process.env.TELEGRAM_TOKEN,
    {
        username: process.env.BOT_USERNAME,
        // @ts-ignore
        channelMode: true,
    }
);

const connection = createConnection({
    type: "sqlite",
    database: process.env.DBASE_PATH,
    entities: [Chat, ChatState, ChatPlatforms, Messages],
    synchronize: true
});

// Create scene manager
const sendingScene = new SendingScene();
const stage = new Stage([sendingScene.getScene()])

const handler = new SongHandler();

bot.use(session());
session.messageToDelete = {};

bot.use(stage.middleware());

bot.command('start', Middlewares.startMdlwr);
bot.command('menu', Middlewares.getMainMenu);

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

bot.catch((error: any) => {
    console.error(error);
});

bot.on(['message', 'channel_post'], ctx => handler.handleMessage(ctx));

startProdMode(bot)
// startDevMode(bot)
// process.env.NODE_ENV === 'production' ? startProdMode(bot) : startDevMode(bot);

function startDevMode(tgbot: Telegraf<TelegrafContext>) {
    tgbot.startPolling();
}

async function startProdMode(tgbot: Telegraf<TelegrafContext>) {
    console.log('Starting a bot in production mode');
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
    console.log('Webhook status', webhookStatus);
}
