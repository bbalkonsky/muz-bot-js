import services from './info'
import IMessage from "./model/IMessage";
import {response, songResponse} from "./resp";
import ISong from "./model/ISong";

function isItLink(messageText: string): boolean {
    for (let service in services) {
        if (messageText.includes(services[service].link)) {
            return true;
        }
    }
    return false;
}
// console.log(isItLink(response.text))


// вместо ссылочки можно вот так попробовать
// bot.send_message('126017510', parse_mode='markdown', text='sdfsdfv[\u200B](https://i.scdn.co/image/ab67616d0000b273ad47eb37aa3ff2a1befc783f)')


function toggleService(toToggle: string, userServices: any[]): any[] {
    const newServices = userServices;
    newServices[toToggle] = newServices[toToggle] ? 0 : 1;
    return newServices;
}

function descriptionTextAndUrl(messageText: string, service: string): string[] {
    const re = new RegExp(`[^\\s]*${service}[^\\s]+`);
    const urlPosition = messageText.search(re);
    const url = messageText.slice(urlPosition).match(re)[0];
    return [urlPosition ? messageText.slice(0, urlPosition - 1) : '', url];
}
// console.log(descriptionTextAndUrl(response.text, 'open.spotify.com'))

function sentBy(message: IMessage, url: string): string {
    let name;
    if (message.from_user.first_name && message.from_user.last_name) {
        name = `${message.from_user.first_name} ${message.from_user.last_name}`;
    } else if (message.from_user.username) {
        name = `${message.from_user.username}`;
    } else if (message.from_user.first_name) {
        name = `${message.from_user.first_name}`;
    } else {
        name = `GODS OF MUSIC`;
    }
    return `Sent by[:](${url}) ${name}`;
}
// console.log(sentBy(response, 'ssilochka'))


function searchVk(songName: string): any {
    const newSongName = songName
        .replace(/\s/g, '%20')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');
    return (services['vk']['alias'], `https://vk.com/search?c%5Bper_page%5D=200&c%5Bq%5D=${newSongName}&c%5Bsection%5D=audio`)
}
// console.log(searchVk('pidor - pro chlen ((extended))'))

function getSongName(response): string {
    const entities = JSON.parse(response.text);
    const keys = entities['entitiesByUniqueId'].keys();
    const firstEntity = entities[keys[0]];
    return `${firstEntity.artistName} - ${firstEntity.title}`
}

function getSongThumb(response): string {
    const res: ISong = JSON.parse(response);
    const keys = Object.keys(res.entitiesByUniqueId);
    return res.entitiesByUniqueId[keys[0]].thumbnailUrl;
}
// console.log(getSongThumb(songResponse));
