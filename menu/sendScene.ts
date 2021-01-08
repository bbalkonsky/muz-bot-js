import session from 'telegraf/session';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import {SceneContextMessageUpdate} from "telegraf/typings/stage";
import {getLeaveSceneButton, getMainMenuButtons} from "./buttons";
import {Markup} from "telegraf";
import {bot} from "../app";
import {addMessageToLog} from "../database/controllers";

const {leave} = Stage;
const contactsScene: Scene = new Scene('contactsScene');

contactsScene.enter(async (ctx: SceneContextMessageUpdate) => {
    const newButtons = getLeaveSceneButton(ctx.from?.language_code);
    await ctx.editMessageText('Следующее твое сообщение будет отправлено моему создателю ' +
        '(только текст, без стикеров, видео и всего такого)',
        {reply_markup: Markup.inlineKeyboard(newButtons)}
    );
    session.messageToDelete[ctx.chat.id] = ctx.update.callback_query.message.message_id;
})

contactsScene.leave(async (ctx: SceneContextMessageUpdate) => {
})

contactsScene.action(/cancel/, getCancel);
contactsScene.hears(/[\w]*/, sendMessageToCreator);

export async function getCancel(ctx) {
    await ctx.deleteMessage();
    const newButtons = getMainMenuButtons(false, ctx.from?.language_code);
    await ctx.reply('Передумаешь - пиши!', Markup.inlineKeyboard(newButtons).extra());
    return ctx.scene.leave();
}

async function sendMessageToCreator(ctx) {
    console.log(ctx.chat)
    if (session.messageToDelete[ctx.chat.id]) {
        await bot.telegram.deleteMessage(ctx.chat.id, session.messageToDelete[ctx.chat.id]);
        delete session.messageToDelete[ctx.chat.id];
    }
    await bot.telegram.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.message.message_id);
    await addMessageToLog(ctx.chat.id, ctx.message, 'reply');
    await ctx.deleteMessage();
    const newButtons = getMainMenuButtons(false, ctx.from?.language_code);
    await ctx.reply('Отлично! Я все передам!', Markup.inlineKeyboard(newButtons).extra());
    return ctx.scene.leave();
}

export default contactsScene;
