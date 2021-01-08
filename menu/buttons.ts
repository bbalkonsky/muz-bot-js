import {Markup} from "telegraf";
import {ChatPlatforms} from "../database/entities/ChatPlatforms";
import {CallbackButton, UrlButton} from "telegraf/typings/markup";
import {ChatState} from "../database/entities/ChatState";
import {platforms} from "../info";

export function getPlatformsButtons(chatPlatforms: ChatPlatforms, cols: number = 3): CallbackButton[][] {
    const buttons = [];
    let tempArray = [];
    let counter = 1;
    for (let platform in chatPlatforms) {
        if (!chatPlatforms.hasOwnProperty(platform)) continue;
        const newButton = Markup.callbackButton(`${chatPlatforms[platform] ? '✅' : '❌'} ${platforms[platform].alias}`, `platform:${platform}`);
        tempArray.push(newButton);
        if (counter < cols) {
            counter++;
        } else {
            buttons.push(tempArray);
            tempArray = [];
            counter = 1;
        }
    }
    if (tempArray.length) buttons.push(tempArray);
    buttons.push([getBackButton('ru'), getCloseButton('ru')]);
    return buttons;
}

export function getBackButton(language: string = 'en'): CallbackButton {
    return Markup.callbackButton(`◀ ${language === 'ru' ? 'Назад' : 'Back'}`, 'back');
}

export function getCloseButton(language: string = 'en'): CallbackButton {
    return Markup.callbackButton(`⏹ ${language === 'ru' ? 'Закрыть' : 'Close'}`, 'close');
}

export function getMainMenuButtons(isPrivate: boolean, language: string = 'en'): CallbackButton[][] {
    let newKeyboard = [];
    newKeyboard.push([
        Markup.callbackButton(`⚙ ${language === 'ru' ? 'Настройки' : 'Chat settings'}`, 'settings'),
        Markup.callbackButton(`⁉ ${language === 'ru' ? 'Помощь' : 'Get help'}`, 'help')
    ]);
    newKeyboard.push([
        Markup.callbackButton(`💰 ${language === 'ru' ? 'Поддержать' : 'Donate'}`, 'donate'),
        Markup.callbackButton(`✏ ${language === 'ru' ? 'Обратная связь' : 'Contacts'}`, 'contacts')
    ]);
    newKeyboard.push([
        getCloseButton(language)
    ]);
    return newKeyboard;
}

export function getSettingsButtons(state: ChatState, language: string = 'en'): CallbackButton[][] {
    return [
        [Markup.callbackButton(`🎧 ${language === 'ru' ? 'Платформы' : 'Platforms'}`, 'platforms')],
        [Markup.callbackButton(`${state.annotations ? '✅' : '❌'}  ${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'state:annotations')],
        // [Markup.callbackButton(`${state.rating ? '✅' : '❌'}  ${language === 'ru' ? 'Рейтинг' : 'Rating'}`, 'state:rating')],
        [getBackButton(language), getCloseButton(language)]
    ];
}

export function getHelpButtons(language: string = 'en'): CallbackButton[][] {
    return [
        [Markup.callbackButton(`${language === 'ru' ? 'Что это вообще?' : 'Annotations'}`, 'helpOption:0')],
        [Markup.callbackButton(`${language === 'ru' ? 'Список платформ' : 'Annotations'}`, 'helpOption:1')],
        [Markup.callbackButton(`${language === 'ru' ? 'Бот в группе или канале' : 'Annotations'}`, 'helpOption:2')],
        [Markup.callbackButton(`${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'helpOption:3')],
        [getBackButton(language), getCloseButton(language)]
    ];
}

export function getDonationsButtons(language: string = 'en'): Array<CallbackButton | UrlButton>[] {
    return [
        [Markup.urlButton(`💵 Yandex Money`, process.env.YMONEY_URL)],
        [Markup.urlButton(`💳 Patreon`, process.env.PATREON_URL)],
        [getBackButton(language), getCloseButton(language)]
    ]
}

export function getLeaveSceneButton(language: string = 'en'): CallbackButton[] {
    return [Markup.callbackButton(`❌ ${language === 'ru' ? 'Отмена' : 'Cancel'}`, 'cancel')];
}

// export function getRatingButtons(): CallbackButton[] {
//     return [
//         Markup.callbackButton(`👍`, 'like'),
//         Markup.callbackButton(`👎`, 'dislike')
//     ];
// }
