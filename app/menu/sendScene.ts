import session from 'telegraf/session';
import Scene from 'telegraf/scenes/base';
import {SceneContextMessageUpdate} from "telegraf/typings/stage";
import Buttons from "./buttons";
import {Markup} from "telegraf";
import {bot} from "../../app";
import DataBaseController from "../database/controllers";

// const {leave} = Stage;

export default class SendingScene {
    contactsScene: Scene = new Scene('contactsScene');

    constructor() {
        this.contactsScene = new Scene('contactsScene');
    }

    public getScene() {
        this.contactsScene.enter(async (ctx: SceneContextMessageUpdate) => {
            const newButtons = Buttons.getLeaveSceneButton(ctx.from?.language_code);
            await ctx.editMessageText('Следующее твое сообщение будет отправлено моему создателю ' +
                '(только текст, без стикеров, видео и всего такого)\n' +
                'P.S. Я вижу только ссылку на профиль, но если он скрыт, я не смогу тебе ответить.',
                {reply_markup: Markup.inlineKeyboard(newButtons)}
            );
            session.messageToDelete[ctx.chat.id] = ctx.update.callback_query.message.message_id;
        })

        // this.contactsScene.leave(async (ctx: SceneContextMessageUpdate) => {
        // })

        this.contactsScene.action(/cancel/, SendingScene.getCancel);
        this.contactsScene.hears(/[\w]*/, SendingScene.sendMessageToCreator);

        return this.contactsScene;
    }

    private static async getCancel(ctx: SceneContextMessageUpdate): Promise<any> {
        await ctx.deleteMessage()
            .then()
            .catch(() => {
                ctx.reply('Что-то пошло не по плану')
            })
            // .finally(() => {
            //     return ctx.scene.leave();
            // });
        const newButtons = Buttons.getMainMenuButtons(false, ctx.from?.language_code);
        await ctx.reply('Передумаешь - пиши!', Markup.inlineKeyboard(newButtons).extra());
        return ctx.scene.leave();
    }

    private static async sendMessageToCreator(ctx: SceneContextMessageUpdate) {
        if (session.messageToDelete[ctx.chat.id]) {
            await bot.telegram.deleteMessage(ctx.chat.id, session.messageToDelete[ctx.chat.id]);
            delete session.messageToDelete[ctx.chat.id];
        }
        await bot.telegram.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.message.message_id);
        await DataBaseController.addMessageToLog(ctx.chat.id, ctx.message, 'reply');
        await ctx.deleteMessage();
        const newButtons = Buttons.getMainMenuButtons(false, ctx.from?.language_code);
        await ctx.reply('Отлично! Я все передам!', Markup.inlineKeyboard(newButtons).extra());
        return ctx.scene.leave();
    }
}
