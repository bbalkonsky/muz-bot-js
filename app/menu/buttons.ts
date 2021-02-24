import {Markup} from "telegraf";
import {ChatPlatforms} from "../database/entities/ChatPlatforms";
import {CallbackButton, UrlButton} from "telegraf/typings/markup";
import {ChatState} from "../database/entities/ChatState";
import Info from "../helpers/info";

export default class Buttons {
    static getPlatformsButtons(chatPlatforms: ChatPlatforms, cols: number = 3): CallbackButton[][] {
        const buttons = [];
        let tempArray = [];
        let counter = 1;
        for (const platform in chatPlatforms) {
            if (!chatPlatforms.hasOwnProperty(platform)) continue;
            const newButton = Markup.callbackButton(
                `${chatPlatforms[platform] ? '✅' : '❌'} ${Info.platforms[platform].alias}`, `platform:${platform}`
            );
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
        buttons.push([Buttons.getBackButton('ru'), Buttons.getCloseButton('ru')]);
        return buttons;
    }

    private static getBackButton(language: string = 'en'): CallbackButton {
        return Markup.callbackButton(`◀ ${language === 'ru' ? 'Назад' : 'Back'}`, 'back');
    }

    private static getCloseButton(language: string = 'en'): CallbackButton {
        return Markup.callbackButton(`⏹ ${language === 'ru' ? 'Закрыть' : 'Close'}`, 'close');
    }

    static getMainMenuButtons(isPrivate: boolean, language: string = 'en'): CallbackButton[][] {
        const newKeyboard = [];
        newKeyboard.push([
            Markup.callbackButton(`⚙ ${language === 'ru' ? 'Настройки' : 'Chat settings'}`, 'settings'),
            Markup.callbackButton(`⁉ ${language === 'ru' ? 'Помощь' : 'Get help'}`, 'help')
        ]);
        newKeyboard.push([
            Markup.callbackButton(`💰 ${language === 'ru' ? 'Поддержать' : 'Donate'}`, 'donate'),
            Markup.callbackButton(`✏ ${language === 'ru' ? 'Обратная связь' : 'Contacts'}`, 'contacts')
        ]);
        newKeyboard.push([
            Buttons.getCloseButton(language)
        ]);
        return newKeyboard;
    }

    static getSettingsButtons(state: ChatState, language: string = 'en'): CallbackButton[][] {
        return [
            [Markup.callbackButton(`🎧 ${language === 'ru' ? 'Платформы' : 'Platforms'}`, 'platforms')],
            [Markup.callbackButton(`${state.annotations ? '✅' : '❌'}  ${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'state:annotations')],
            // [Markup.callbackButton(`${state.rating ? '✅' : '❌'}  ${language === 'ru' ? 'Рейтинг' : 'Rating'}`, 'state:rating')],
            [Buttons.getBackButton(language), Buttons.getCloseButton(language)]
        ];
    }

    static getHelpButtons(language: string = 'en'): CallbackButton[][] {
        return [
            [Markup.callbackButton(`${language === 'ru' ? 'Что это вообще?' : 'Annotations'}`, 'helpOption:0')],
            [Markup.callbackButton(`${language === 'ru' ? 'Список платформ' : 'Annotations'}`, 'helpOption:1')],
            [Markup.callbackButton(`${language === 'ru' ? 'Бот в группе или канале' : 'Annotations'}`, 'helpOption:2')],
            [Markup.callbackButton(`${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'helpOption:3')],
            [Buttons.getBackButton(language), Buttons.getCloseButton(language)]
        ];
    }

    static getDonationsButtons(language: string = 'en'): (CallbackButton | UrlButton)[][] {
        return [
            [Markup.urlButton(`💵 Yandex Money`, process.env.YMONEY_URL)],
            [Markup.urlButton(`💳 Patreon`, process.env.PATREON_URL)],
            [Buttons.getBackButton(language), Buttons.getCloseButton(language)]
        ]
    }

    static getLeaveSceneButton(language: string = 'en'): CallbackButton[] {
        return [Markup.callbackButton(`❌ ${language === 'ru' ? 'Отмена' : 'Cancel'}`, 'cancel')];
    }
}
// static getRatingButtons(): CallbackButton[] {
//     return [
//         Markup.callbackButton(`👍`, 'like'),
//         Markup.callbackButton(`👎`, 'dislike')
//     ];
// }
