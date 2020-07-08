import services from './info'
import Message from "./model/message";

function isItLink(messageText: string): boolean {
    for (let service in services) {
        if (messageText.includes(services[service].link)) {
            return true;
        }
    }
    return false;
}


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

function sentBy(message: Message, url: string): string {
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


function searchVk(songName: string): any {
    const newSongName = songName.replace(' ', '%20').replace(
        '(', '%28').replace(')', '%29');
    return (services['vk']['alias'], `https://vk.com/search?c%5Bper_page%5D=200&c%5Bq%5D=${newSongName}&c%5Bsection%5D=audio`)
}

function getSongName(response): string {
    const entities = JSON.parse(response.text);
    const keys = entities['entitiesByUniqueId'].keys();
    const firstEntity = entities[keys[0]];
    return `${firstEntity.artistName} - ${firstEntity.title}`
}
