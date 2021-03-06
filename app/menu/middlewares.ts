import Buttons from "./buttons";
import {Markup} from "telegraf";
import {SceneContextMessageUpdate} from "telegraf/typings/stage";
import DataBaseController from "../database/controllers";
import Info from "../helpers/info";
import {getRepository} from "typeorm";
import {Chat} from "../database/entities/Chat";
import {TelegrafContext} from "telegraf/typings/context";
import { version } from '../../package.json'
import Helpers from "../helpers/helpers";


// TODO
export default class Middlewares {
    static async startMdlwr(ctx) {
        const isUserExist = Middlewares.getOrCreateChat(ctx);
        if (!isUserExist) {
            await ctx.reply('Привет! Отправляй мне ссылку на песню и увидишь магию!\nВсе остальное спрятано за /menu');
        } else {
            await ctx.reply('Ну и зачем?');
        }
    }

    public static async getMainMenu(ctx: TelegrafContext) {
        await Middlewares.getOrCreateChat(ctx);
        await ctx.deleteMessage();
        const newButtons = Buttons.getMainMenuButtons(ctx);
        return ctx.reply('Привет! Чем могу помочь?', Markup.inlineKeyboard(newButtons).extra());
    }

    public static async getPlatforms(ctx: TelegrafContext) {
        const platforms = await DataBaseController.getChatPlatforms(ctx.chat.id);
        const newButtons = Buttons.getPlatformsButtons(platforms);
        return ctx.editMessageText('Доступные платформы', {reply_markup: Markup.inlineKeyboard(newButtons)});
    }

    public static async getSettings(ctx: TelegrafContext) {
        const state = await DataBaseController.getChatState(ctx.chat.id);
        const newButtons = Buttons.getSettingsButtons(state, ctx.from?.language_code);
        return ctx.editMessageText('Настройки бота', {reply_markup: Markup.inlineKeyboard(newButtons)});
    }

    public static async getDonations(ctx: TelegrafContext) {
        const newButtons = Buttons.getDonationsButtons(ctx.from?.language_code);
        return ctx.editMessageText('Поддержать автора', {reply_markup: Markup.inlineKeyboard(newButtons)});
    }

    public static async getHelp(ctx: TelegrafContext) {
        const newButtons = Buttons.getHelpButtons(ctx.from?.language_code);
        return ctx.editMessageText('Есть вопросы? Сейчас отвечу', {reply_markup: Markup.inlineKeyboard(newButtons)});
    }

    public static async getHelpOption(ctx: TelegrafContext) {
        const newButtons = Buttons.getHelpButtons(ctx.from?.language_code);
        const helpCode = ctx.update.callback_query?.data.split(':')[1];
        const helpText = Info.instRu[helpCode];
        await ctx.editMessageText(helpText, {reply_markup: Markup.inlineKeyboard(newButtons)})
            .then()
            .catch(err => {
                if (err.response?.description?.includes('Bad Request: message is not modified')) {
                     // Пользователь может решить потыкать в одну кнопку много раз
                    const helpButtons = Buttons.getHelpButtons(ctx.from?.language_code);
                    ctx.editMessageText('Ну и зачем опять нажал?', {reply_markup: Markup.inlineKeyboard(helpButtons)});
                } else {
                    ctx.reply('Что-то явно пошло не так');
                }
            });
    }

    public static async getPlatformOption(ctx: TelegrafContext) {
        const platform = ctx.update.callback_query?.data.split(':')[1];
        const newPlatforms = await DataBaseController.toggleChatPlatform(ctx.chat.id, platform);
        const newButtons = await Buttons.getPlatformsButtons(newPlatforms);
        return ctx.editMessageReplyMarkup(Markup.inlineKeyboard(newButtons));
    }

    public static async getStateOption(ctx: TelegrafContext) {
        const platform = ctx.update.callback_query?.data.split(':')[1];
        const newState = await DataBaseController.toggleChatState(ctx.chat.id, platform);
        const newButtons = await Buttons.getSettingsButtons(newState, ctx.from?.language_code);
        return ctx.editMessageReplyMarkup(Markup.inlineKeyboard(newButtons));
    }

    public static async startContactsScene(ctx: SceneContextMessageUpdate): Promise<any> {
        return ctx.scene.enter('feedbackScene');
    }

    public static async getBack(ctx): Promise<any> {
        const newButtons = Buttons.getMainMenuButtons(ctx);
        return ctx.editMessageText('Привет! Чем могу помочь?', {reply_markup: Markup.inlineKeyboard(newButtons)});
    }

    public static async getClose(ctx: TelegrafContext): Promise<any> {
        return ctx.deleteMessage()
            .then()
            .catch(() => {
                ctx.reply('Я не могу удалить это сообщение.\nВероятнее всего, оно слишком старое.');
            });
    }

    public static async getOrCreateChat(ctx: TelegrafContext): Promise<boolean> {
        // TODO
        const chat = await getRepository(Chat).findOne(ctx.chat.id);
        if (!chat) {
            const dateTime = ctx.message ? ctx.message.date : ctx.channelPost.date;
            await DataBaseController.createChat(ctx.chat.id, ctx.chat.type, dateTime);
            return false;
        } else {
            return true;
        }
    }

    public static async sendBotVersion(ctx: TelegrafContext): Promise<any> {
        return ctx.reply(version);
    }

    public static async startNotifyScene(ctx: SceneContextMessageUpdate): Promise<any> {
        return Helpers.isAdmin(ctx.chat.id)
            ? ctx.scene.enter('notifyScene')
            : null;
    }
}
