import Info from './info'
import axios from 'axios';
import {UrlButton} from "telegraf/typings/markup";
import {Markup} from "telegraf";
import {ChatPlatforms} from "../database/entities/ChatPlatforms";
import {User} from "telegraf/typings/telegram-types";
import DataBaseController from "../database/controllers";
import Middlewares from "../menu/middlewares";
import {Song} from "../models/song";

export default class SongHandler {
    private getSongName(response: Song): {title: string, artist: string} {
        const keys = Object.keys(response.entitiesByUniqueId);
        const firstEntity = response.entitiesByUniqueId[keys[0]];
        return {title: firstEntity.title, artist: firstEntity.artistName};
    }

    private getSongThumb(response: Song): string {
        const keys = Object.keys(response.entitiesByUniqueId);
        return response.entitiesByUniqueId[keys[0]].thumbnailUrl;
    }

    private async getSongInfo(url: string): Promise<any> {
        const options = {
            url,
            key: process.env.ODESLI_TOKEN
        }
        try {
            const response = await axios.get(process.env.ODESLI_API_URL, {params: options});
            return response.data;
        } catch(e) {
            return e.response.status;
        }
    }

    private getUrlAndDescription(messageText: string): false | {description: string, url: string} {
        for (const platform in Info.platforms) {
            if (Info.platforms.hasOwnProperty(platform)) {
                const re = new RegExp(`(?:https\\:\/\/|http\\:\/\/)${Info.platforms[platform].link}[\\S]+`, 'gmi');
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
        }
        return false;
    }
    private getSongLinksButtons(response: Song, chatPlatforms: ChatPlatforms, songName: {title: string, artist: string}, cols:number = 3): UrlButton[][] {
        const buttons = [];
        let tempArray = [];
        let counter = 1;
        const linksByPlatform = response.linksByPlatform;
        if (chatPlatforms.vk) {
            const songFullName = `${songName.artist} - ${songName.title}`;
            linksByPlatform.vk = {url: this.searchVk(songFullName)};
        }
        const keys = Object.keys(response.linksByPlatform);
        keys.forEach(key => {
            if (chatPlatforms[key]) {
                const newButton = Markup.urlButton(`${Info.platforms[key].alias}`, `${response.linksByPlatform[key].url}`);
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

    private searchVk(songName: string): string {
        const newSongName = songName
            .replace(/\s/g, '%20')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/&/g, '%26');
        return `https://vk.com/search?c%5Bper_page%5D=200&c%5Bq%5D=${newSongName}&c%5Bsection%5D=audio`;
    }

    private prepareReplyText(songName, songThumb, chatAnnotations, signature) {
        const annotations = chatAnnotations.length ? `${chatAnnotations}\n—\n` : '';
        return `${annotations}*${songName.title}*\n${songName.artist}[\u200B](${songThumb})${signature}`
    }

    private sentBy(message: User, chatType: string): string { // TODO запили тоже проверку языка
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

    public async handleMessage(ctx) {
        const messageText = ctx.message?.text || ctx.channelPost?.text || '';
        const chatInput = this.getUrlAndDescription(messageText);

        if (chatInput) {
            await Middlewares.getOrCreateChat(ctx);
            await DataBaseController.addMessageToLog(ctx.chat.id, messageText, 'private');

            const chatPlatforms = await DataBaseController.getChatPlatforms(ctx.chat.id);
            const songInfo = await this.getSongInfo(chatInput.url);

            if (typeof songInfo !== 'number') {
                const songName = this.getSongName(songInfo);
                const songThumb = this.getSongThumb(songInfo);
                const buttons = this.getSongLinksButtons(songInfo, chatPlatforms, songName);

                const chatState = await DataBaseController.getChatState(ctx.chat.id);
                const chatAnnotations = chatState.annotations ? chatInput.description : '';

                const signature = this.sentBy(ctx.from, ctx.chat.type);
                const replyText = this.prepareReplyText(songName, songThumb, chatAnnotations, signature)

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
}
