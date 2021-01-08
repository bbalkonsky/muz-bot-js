import {
    getHelpButtons,
    getMainMenuButtons,
    getPlatformsButtons,
    getSettingsButtons,
    getDonationsButtons, getLeaveSceneButton
} from "./buttons";
import {Markup} from "telegraf";
import {SceneContextMessageUpdate} from "telegraf/typings/stage";
import {
    addMessageToLog,
    createChat,
    getChatPlatforms,
    getChatState,
    toggleChatPlatform,
    toggleChatState
} from "../database/controllers";
import {instRu} from "../info";
import {getRepository} from "typeorm";
import {Chat} from "../database/entities/Chat";
import {
    getSongInfo,
    getSongLinksButtons,
    getSongName,
    getSongThumb,
    getUrlAndDescription,
    prepareReplyText,
    sentBy
} from "../scripts";

export async function startMdlwr(ctx) {
    const isuserExist = getOrCreateChat(ctx);
    if (!isuserExist) {
        await ctx.reply('Привет! Отправляй мне ссылку на песню и увидишь магию!\nВсе остальное спрятано за /menu');
    } else {
        await ctx.reply('Ну и зачем?');
    }
}

export async function getMainMenu(ctx) {
    await getOrCreateChat(ctx);
    await ctx.deleteMessage();
    const newButtons = getMainMenuButtons(!!ctx.message, ctx.from?.language_code);
    return ctx.reply('Привет! Чем могу помочь?', Markup.inlineKeyboard(newButtons).extra());
}

export async function getPlatforms(ctx) {
    const platforms = await getChatPlatforms(ctx.chat.id);
    const newButtons = getPlatformsButtons(platforms);
    return ctx.editMessageText('Доступные платформы', {reply_markup: Markup.inlineKeyboard(newButtons)});
}

export async function getSettings(ctx) {
    const state = await getChatState(ctx.chat.id);
    const newButtons = getSettingsButtons(state, ctx.from?.language_code);
    return ctx.editMessageText('Настройки бота', {reply_markup: Markup.inlineKeyboard(newButtons)});
}

export async function getDonations(ctx) {
    const newButtons = getDonationsButtons(ctx.from?.language_code);
    return ctx.editMessageText('Поддержать автора', {reply_markup: Markup.inlineKeyboard(newButtons)});
}

export async function getHelp(ctx) {
    const newButtons = getHelpButtons(ctx.from?.language_code);
    return ctx.editMessageText('Есть вопросы? Сейчас отвечу', {reply_markup: Markup.inlineKeyboard(newButtons)});
}

export async function getHelpOption(ctx) {
    const newButtons = getHelpButtons(ctx.from?.language_code);
    const helpCode = ctx.update.callback_query?.data.split(':')[1];
    const helpText = instRu[helpCode];
    try {
        await ctx.editMessageText(helpText, {reply_markup: Markup.inlineKeyboard(newButtons)})
    } catch (error) {
        /**
         * Пользователь может решить потыкать в одну кнопку много раз
         */
        if (error.response?.description?.includes('Bad Request: message is not modified')) {
            const newButtons = getHelpButtons(ctx.from?.language_code);
            await ctx.editMessageText('Ну и зачем опять нажал?', {reply_markup: Markup.inlineKeyboard(newButtons)});
        } else {
            throw(error);
        }
    }
}

export async function getPlatformOption(ctx) {
    const platform = ctx.update.callback_query?.data.split(':')[1];
    const newPlatforms = await toggleChatPlatform(ctx.chat.id, platform);
    const newButtons = await getPlatformsButtons(newPlatforms);
    return ctx.editMessageReplyMarkup(Markup.inlineKeyboard(newButtons));
}

export async function getStateOption(ctx) {
    const platform = ctx.update.callback_query?.data.split(':')[1];
    const newState = await toggleChatState(ctx.chat.id, platform);
    const newButtons = await getSettingsButtons(newState, ctx.from?.language_code);
    return ctx.editMessageReplyMarkup(Markup.inlineKeyboard(newButtons));
}

export async function startContactsScene(ctx: SceneContextMessageUpdate) {
    return ctx.scene.enter('contactsScene');
}

export async function getBack(ctx) {
    const newButtons = getMainMenuButtons(ctx.chat.type === 'private', ctx.from?.language_code);
    return ctx.editMessageText('Привет! Чем могу помочь?', {reply_markup: Markup.inlineKeyboard(newButtons)});
}

export async function getClose(ctx) {
    return ctx.deleteMessage();
}

export async function messageHandler(ctx) {
    const messageText = ctx.message?.text || ctx.channelPost?.text || '';
    const chatInput = getUrlAndDescription(messageText);
    if (chatInput) {
        await getOrCreateChat(ctx);
        await addMessageToLog(ctx.chat.id, messageText, 'private');

        const chatPlatforms = await getChatPlatforms(ctx.chat.id);
        const songInfo = await getSongInfo(chatInput.url);

        if (typeof songInfo !== 'number') {
            const songName = getSongName(songInfo);
            const songThumb = getSongThumb(songInfo);
            const buttons = getSongLinksButtons(songInfo, chatPlatforms, songName);

            const chatState = await getChatState(ctx.chat.id);
            const chatAnnotations = chatState.annotations ? chatInput.description : '';

            const signature = sentBy(ctx.from, ctx.chat.type);
            const replyText = prepareReplyText(songName, songThumb, chatAnnotations, signature)

            await ctx.deleteMessage();
            await ctx.replyWithMarkdown(replyText, Markup.inlineKeyboard(buttons).extra());
        } else {
            switch (songInfo) {
                case 404: {
                    await ctx.reply('Ничего не нашел, сорян');
                    break;
                }
                default: {
                    throw(new Error('Unhandled error'));
                }
            }
        }
    }
}

async function getOrCreateChat(ctx): Promise<boolean> {
    const chat = await getRepository(Chat).findOne(ctx.chat.id);
    if (!chat) {
        const dateTime = ctx.message ? ctx.message.date : ctx.channelPost.date;
        await createChat(ctx.chat.id, ctx.chat.type, dateTime);
        return false;
    } else {
        return true;
    }
}
