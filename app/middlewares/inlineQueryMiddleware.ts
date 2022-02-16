import {TelegrafContext} from "telegraf/typings/context";
import axios from "axios";
import DataBaseController from "../database/controllers";
import Helpers from "../helpers/helpers";
import {getSongLinksButtons, getSongName, getSongThumb, replaceUnderline} from "../helpers/songHandler";
import {Markup} from "telegraf";
import Middlewares from "../menu/middlewares";

const globalObject: any = global;
const urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);

const handleInlineQuery = async (ctx: TelegrafContext): Promise<any> => {
    const { inlineQuery, answerInlineQuery } = ctx;

    const query = inlineQuery.query;
    if (!query) {
        return answerInlineQuery([]);
    }

    let response;
    let odesliOptionsUrl;

    if (query.match(urlRegex)) {
        odesliOptionsUrl = [encodeURIComponent(query)];
    } else {
        const options = {
            term: query,
            entity: 'song,album,podcast'
        };

        let result;
        try {
            result = await axios.get('https://itunes.apple.com/search', {params: options});
            console.log(result.status)
        } catch(e) {
            result = null;
        }

        if (result?.data?.resultCount) {
            odesliOptionsUrl = result?.data?.results.slice(0, 5).map(x => x.trackViewUrl ?? x.collectionViewUrl) ?? [];
        } else {
            return;
        }
    }

    try {
        const queries = odesliOptionsUrl.map(x => {
            const options = {key: process.env.ODESLI_TOKEN, url: x};
            return axios.get(process.env.ODESLI_API_URL, {params: options});
        })
        response = await Promise.allSettled(queries);
    } catch(e) {
        response = null;
    }

    if (!response) {
        return;
    }

    await Middlewares.getOrCreateChat(ctx.update.inline_query.from.id, 'private');
    const chatPlatforms = await DataBaseController.getChatPlatforms(inlineQuery.from.id);

    const res = [];
    for (const x of response) {
        if (x.status === 'rejected') {
            continue;
        }

        const song = x.value.data;

        try {
            res.push(generateInlineSongItem(song, chatPlatforms));
        } catch (e) {
            return;
        }
    }

    const chatId = inlineQuery.from.id;
    if (!Helpers.isAdmin(chatId)) {
        if (globalObject.inlineCounter.id !== chatId) {
            globalObject.inlineCounter = { id: chatId, time: Date.now() };
            sendConsoleLog(chatId);
        } else if (Date.now() - globalObject.inlineCounter.time > 60000) { // one minute
            globalObject.inlineCounter.time = Date.now();
            sendConsoleLog(chatId);
        }
    }

    return answerInlineQuery(res, {
        switch_pm_text: 'Перейти в диалог',
        switch_pm_parameter: 'nope'
    });
}

const generateInlineSongItem = (song: any, chatPlatforms): any => {
    const songName = getSongName(song);
    const songThumb = getSongThumb(song);
    const buttons = getSongLinksButtons(song, chatPlatforms, songName);

    if (!buttons.length) {
        return;
    }

    const title = replaceUnderline(songName.title);
    const artist = replaceUnderline(songName.artist);
    const replyText = `*${title}*\n${artist}[\u200B](${songThumb})`;

    const firstEntity = song.entitiesByUniqueId[song.entityUniqueId];

    return {
        id: Math.random() * Math.random(),
        type: 'article',
        thumb_url: firstEntity.thumbnailUrl,
        title: firstEntity.title,
        description: firstEntity.artistName,
        // @ts-ignore
        url: Object.values(song.linksByPlatform)[0].url,
        hide_url: true,
        reply_markup: Markup.inlineKeyboard(buttons),
        input_message_content: {
            message_text: replyText,
            parse_mode: 'Markdown'
        }
    }
}

const sendConsoleLog = (chatId: number): void => {
    console.log(
        JSON.stringify({
            messageType: 'message',
            chatId,
            chatType: 'inline',
        })
    );
}

export { handleInlineQuery };
