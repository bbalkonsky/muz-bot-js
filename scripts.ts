import {platforms} from './info'
import Song from "./model/Song";
import axios from 'axios';
import {UrlButton} from "telegraf/typings/markup";
import {Markup} from "telegraf";
import {ChatPlatforms} from "./database/entities/ChatPlatforms";
import {User} from "telegraf/typings/telegram-types";

export function getSongName(response: Song): {title: string, artist: string} {
    const keys = Object.keys(response.entitiesByUniqueId);
    const firstEntity = response.entitiesByUniqueId[keys[0]];
    return {title: firstEntity.title, artist: firstEntity.artistName}
}

export function getSongThumb(response: Song): string {
    const keys = Object.keys(response.entitiesByUniqueId);
    return response.entitiesByUniqueId[keys[0]].thumbnailUrl;
}

export async function getSongInfo(url: string): Promise<any> {
    const options = {
        url: url,
        key: process.env.ODESLI_TOKEN
    }
    try {
        const response = await axios.get(process.env.ODESLI_API_URL, {params: options});
        return response.data;
    } catch(e) {
        return e.response.status;
    }
}

/**
 * ищем в messageText вхождение ссылок на различные платформы (расположены по частоте), если не находим - возвращаем false
 * иначе возвращаем объект с описанием description ( если есть) и ссылкой на песню url
 */

export function getUrlAndDescription(messageText: string): false | {description: string, url: string} {
    for (let platform in platforms) {
        const re = new RegExp(`(?:https\\:\/\/|http\\:\/\/)${platforms[platform].link}[\\S]+`, 'gmi');
        const urlPosition = messageText.search(re);
        if (urlPosition >= 0) {
            const url = messageText.match(re)[0];
            const description = urlPosition ? messageText.slice(0, urlPosition).trim() : '';
            return {
                description,
                url
            };
        }
    }
    return false;
}
export function getSongLinksButtons(response: Song, chatPlatforms: ChatPlatforms, songName: {title: string, artist: string}, cols:number = 3): UrlButton[][] {
    const buttons = [];
    let tempArray = [];
    let counter = 1;
    const linksByPlatform = response.linksByPlatform;
    if (chatPlatforms.vk) {
        const songFullName = `${songName.artist} - ${songName.title}`;
        linksByPlatform.vk = {url: searchVk(songFullName)};
    }
    const keys = Object.keys(response.linksByPlatform);
    keys.forEach(key => {
        if (chatPlatforms[key]) {
            const newButton = Markup.urlButton(`${platforms[key].alias}`, `${response.linksByPlatform[key].url}`);
            tempArray.push(newButton);
            if (counter < cols) {
                counter++;
            } else {
                buttons.push(tempArray);
                tempArray = [];
                counter = 1;
            }
        }
    });
    if (tempArray.length) buttons.push(tempArray);
    return buttons;
}

function searchVk(songName: string): string {
    const newSongName = songName
        .replace(/\s/g, '%20')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/&/g, '%26');
    return `https://vk.com/search?c%5Bper_page%5D=200&c%5Bq%5D=${newSongName}&c%5Bsection%5D=audio`;
}

export function prepareReplyText(songName, songThumb, chatAnnotations, signature) {
    const annotations = chatAnnotations.length ? `${chatAnnotations}\n—\n` : '';
    return `${annotations}*${songName.title}*\n${songName.artist}[\u200B](${songThumb})${signature}`
}

export function sentBy(message: User, chatType: string): string { // TODO запили тоже проверку языка
    if (chatType === 'private') {
        return '';
    } else if (chatType === 'channel') {
        return `\n—\nvia @muzsharebot`;
    } else {
        let name;
        if (message.username) {
            name = `@${message.username}`;
        } else if (message.first_name && message.last_name) {
            name = `${message.first_name} ${message.last_name}`;
        } else if (message.first_name) {
            name = `${message.first_name}`;
        }
        return `\n—\nSent by [${name}](tg://user?id=${message.id})`;
    }
}
