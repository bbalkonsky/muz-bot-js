import {TelegrafContext} from "telegraf/typings/context";
import axios from "axios";
import DataBaseController from "../database/controllers";
import Helpers from "../helpers/helpers";
import {getSongLinksButtons, getSongName, getSongThumb, replaceUnderline} from "../helpers/songHandler";
import {Markup} from "telegraf";
import Middlewares from "../menu/middlewares";

const globalObject: any = global;
const urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
const answerExtra = {
    switch_pm_text: 'Ничего не найдено',
    switch_pm_parameter: 'null',
};

const handleInlineQuery = async (ctx: TelegrafContext): Promise<any> => {
    const { inlineQuery, answerInlineQuery } = ctx;

    const query = inlineQuery.query;
    if (!query) {
        return answerInlineQuery([], answerExtra);
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
        } catch(e) {
            result = null;
            return answerInlineQuery([], answerExtra);
        }

        if (result?.data?.resultCount) {
            odesliOptionsUrl = result?.data?.results.slice(0, 5).map(x => x.trackViewUrl ?? x.collectionViewUrl) ?? [];
        } else {
            return answerInlineQuery([], answerExtra);
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
        return answerInlineQuery([], answerExtra);
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
            return answerInlineQuery([], answerExtra);
        }
    }

    return answerInlineQuery(res, {
        switch_pm_text: 'Перейти в диалог',
        switch_pm_parameter: 'null',
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
        id: createRandomString(),
        type: 'article',
        thumb_url: firstEntity.thumbnailUrl ?? '',
        title: firstEntity.title ?? '',
        description: firstEntity.artistName ?? '',
        // @ts-ignore
        url: Object.values(song.linksByPlatform)[0]?.url ?? '',
        hide_url: true,
        reply_markup: Markup.inlineKeyboard(buttons),
        input_message_content: {
            message_text: replyText,
            parse_mode: 'Markdown'
        }
    }
}

const createRandomString = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 20; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


export { handleInlineQuery };
