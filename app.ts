import {TelegrafContext} from "telegraf/typings/context";

require('dotenv').config();
import fs from 'fs';
import {Telegraf, Telegram} from 'telegraf';
import {platforms} from "./info";
import {createConnection} from "typeorm";
import {Chat} from "./database/entities/Chat";
import {ChatState} from "./database/entities/ChatState";
import {ChatPlatforms} from "./database/entities/ChatPlatforms";
import {Messages} from "./database/entities/Messages";
import session from 'telegraf/session';
import Stage from 'telegraf/stage';
import contactsScene from "./menu/sendScene";
import {
    getBack, getClose,
    getHelp,
    getHelpOption,
    getMainMenu, getPlatformOption,
    getPlatforms,
    getDonations, getSettings, getStateOption, messageHandler, startMdlwr,
    startContactsScene
} from "./menu/middlewares";

export const bot = new Telegraf(
    process.env.TELEGRAM_TOKEN,
    {
        username: process.env.BOT_USERNAME,
        // @ts-ignore
        channelMode: true
    }
);

const connection = createConnection({
    type: "sqlite",
    database: process.env.DBASE_PATH,
    entities: [Chat, ChatState, ChatPlatforms, Messages],
    synchronize: true
});

// Create scene manager
const stage = new Stage([contactsScene])

bot.use(session());
session.messageToDelete = {};

bot.use(stage.middleware());

bot.command('start', startMdlwr);
bot.command('menu', getMainMenu);

bot.action('contacts', startContactsScene);
bot.action('platforms', getPlatforms);
bot.action('settings', getSettings);
bot.action('donate', getDonations);
bot.action('help', getHelp);
bot.action(/helpOption:[0-9]/, getHelpOption);
bot.action(/platform:[\w]+/, getPlatformOption);
bot.action(/state:[\w]+/, getStateOption);
bot.action('back', getBack);
bot.action('close', getClose);

bot.catch((error: any) => {
    console.error(error);
});

bot.on(['message', 'channel_post'], messageHandler);

process.env.NODE_ENV === 'production' ? startProdMode(bot) : startDevMode(bot);

function startDevMode(bot: Telegraf<TelegrafContext>) {
    bot.startPolling();
}

async function startProdMode(bot: Telegraf<TelegrafContext>) {
    console.log('Starting a bot in production mode');
    const telegram = new Telegram(process.env.TELEGRAM_TOKEN, {});

    await telegram.deleteWebhook();

    const tlsOptions = {
        key: fs.readFileSync(process.env.PATH_TO_KEY),
        cert: fs.readFileSync(process.env.PATH_TO_CERT)
    };

    await bot.telegram.setWebhook(
        `${process.env.WEBHOOK_URL}:${process.env.WEBHOOK_PORT}/${process.env.TELEGRAM_TOKEN}`,
        {
            source: 'cert.pem'
        }
    );

    await bot.startWebhook(`/${process.env.TELEGRAM_TOKEN}`, tlsOptions, +process.env.WEBHOOK_PORT);

    const webhookStatus = await telegram.getWebhookInfo();
    console.log('Webhook status', webhookStatus);
}
