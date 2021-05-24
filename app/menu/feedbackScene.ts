import session from 'telegraf/session';
import Scene from 'telegraf/scenes/base';
import {SceneContextMessageUpdate} from "telegraf/typings/stage";
import Buttons from "./buttons";
import {Markup} from "telegraf";
import {bot} from "../../app";
const globalObject: any = global;


export default class FeedbackScene {

    constructor(
        private readonly scene: Scene = new Scene('feedbackScene')
    ) {}

    public getScene() {
        this.scene.enter(async (ctx: SceneContextMessageUpdate) => {
            const newButtons = Buttons.getLeaveSceneButton(ctx.from?.language_code);
            await ctx.editMessageText('Следующее твое сообщение будет отправлено моему создателю ' +
                '(только текст, без стикеров, видео и всего такого)\n' +
                'P.S. Я вижу только ссылку на профиль, но если он скрыт, я не смогу тебе ответить.',
                {reply_markup: Markup.inlineKeyboard(newButtons)}
            );
            session.messageToDelete[ctx.chat.id] = ctx.update.callback_query.message.message_id;
        })

        this.scene.action(/cancel/, FeedbackScene.getCancel);
        this.scene.hears(/[\w]*/, FeedbackScene.sendMessageToCreator);

        return this.scene;
    }

    private static async getCancel(ctx: SceneContextMessageUpdate): Promise<any> {
        await ctx.deleteMessage()
            .then()
            .catch(() => {
                ctx.reply('Что-то пошло не по плану')
            })
        const newButtons = Buttons.getMainMenuButtons(ctx);
        await ctx.reply('Передумаешь - пиши!', Markup.inlineKeyboard(newButtons).extra());
        return ctx.scene.leave();
    }

    private static async sendMessageToCreator(ctx: SceneContextMessageUpdate) {
        if (session.messageToDelete[ctx.chat.id]) {
            await bot.telegram.deleteMessage(ctx.chat.id, session.messageToDelete[ctx.chat.id]);
            delete session.messageToDelete[ctx.chat.id];
        }

        await bot.telegram.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.message.message_id);
        globalObject.loger.info('feedback', JSON.stringify({
            chatId: ctx.chat.id,
            message: ctx.message.text
        }));
        await ctx.deleteMessage()
            .then()
            .catch(() => {
                ctx.reply('Я не могу удалить это сообщение.\nВероятнее всего, оно слишком старое.');
            });
        const newButtons = Buttons.getMainMenuButtons(ctx);
        await ctx.reply('Отлично! Я все передам!', Markup.inlineKeyboard(newButtons).extra());
        return ctx.scene.leave();
    }
}
