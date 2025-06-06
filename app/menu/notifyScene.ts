import session from 'telegraf/session';
import Scene from 'telegraf/scenes/base';
import {SceneContextMessageUpdate} from "telegraf/typings/stage";
import {getLeaveSceneButton, getMainMenuButtons} from './buttons';
import {Markup} from "telegraf";
import {bot} from "../../app";
import DataBaseController from "../database/controllers";

const globalObject: any = global;


export default class NotifyScene {

    constructor(
        private readonly scene: Scene = new Scene('notifyScene')
    ) {}

    public getScene(): Scene {
        this.scene.enter(async (ctx: SceneContextMessageUpdate) => {
            const newButtons = getLeaveSceneButton(ctx.from?.language_code);
            await ctx.editMessageText('Ну и що ты таки хочешь всем сказать?',
                {reply_markup: Markup.inlineKeyboard(newButtons)}
            );
            session.messageToDelete[ctx.chat.id] = ctx.update.callback_query.message.message_id;
        })

        this.scene.action(/cancel/, NotifyScene.getCancel);
        this.scene.hears(/[\w]*/, NotifyScene.sendMessageToUsers);

        return this.scene;
    }

    private static async getCancel(ctx: SceneContextMessageUpdate): Promise<any> {
        await ctx.deleteMessage()
            .then()
            .catch(() => {
                ctx.reply('Что-то пошло не по плану')
            })
        const newButtons = getMainMenuButtons(ctx);
        await ctx.reply('well...', Markup.inlineKeyboard(newButtons).extra());
        return ctx.scene.leave();
    }

    private static async sendMessageToUsers(ctx: SceneContextMessageUpdate) {
        if (session.messageToDelete[ctx.chat.id]) {
            await bot.telegram.deleteMessage(ctx.chat.id, session.messageToDelete[ctx.chat.id]);
            delete session.messageToDelete[ctx.chat.id];
        }

        let sended = 0;
        DataBaseController.getAllUsers().then(res => {
            const users: string[] = res.map(i => i.id);
            users.forEach((user, idx) => {
                sended++;
                bot.telegram.sendMessage(user, ctx.message.text)
                    .catch(() => globalObject.loger.error('Не смог послать сообщение'));
            });
        });

        await ctx.deleteMessage()
            .then()
            .catch(() => {
                ctx.editMessageText('Я не могу удалить это сообщение.\nВероятнее всего, оно слишком старое.');
            });
        const newButtons = getMainMenuButtons(ctx);
        await ctx.reply(`Отправил вот стольким людям: ${sended}`, Markup.inlineKeyboard(newButtons).extra());
        return ctx.scene.leave();
    }
}
