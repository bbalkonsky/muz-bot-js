import {Markup} from "telegraf";
import {ChatPlatforms} from "../database/entities/ChatPlatforms";
import {CallbackButton, UrlButton} from "telegraf/typings/markup";
import {ChatState} from "../database/entities/ChatState";
import Info from "../helpers/info";
import {TelegrafContext} from "telegraf/typings/context";
import Helpers from "../helpers/helpers";

export default class Buttons {
    public static getPlatformsButtons(chatPlatforms: ChatPlatforms): CallbackButton[][] {
        const buttons = [];
        let tempArray = [];
        let counter = 1;
        const cols = 3;
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

    public static getMainMenuButtons(ctx: TelegrafContext): CallbackButton[][] {
        const newKeyboard = [];
        const language = ctx.from?.language_code ?? 'en';
        const isPrivate = ctx.chat.type === 'private';

        newKeyboard.push(
            [Markup.callbackButton(`⚙ ${language === 'ru' ? 'Настройки' : 'Chat settings'}`, 'settings')],
            [Markup.callbackButton(`⁉ ${language === 'ru' ? 'Помощь' : 'Get help'}`, 'help')]
        );
        newKeyboard.push([
            // Markup.callbackButton(`💰 ${language === 'ru' ? 'Поддержать' : 'Donate'}`, 'donate'),
            Markup.callbackButton(`✏ ${language === 'ru' ? 'Написать автору' : 'Contacts'}`, 'contacts'),
        ]);

        newKeyboard.push([
            Markup.callbackButton('🤔 Сказать всем !!!', 'notify', !Helpers.isAdmin(ctx.chat.id))
        ]);

        newKeyboard.push([
            Buttons.getCloseButton(language)
        ]);
        return newKeyboard;
    }

    public static getSettingsButtons(state: ChatState, language: string = 'en'): CallbackButton[][] {
        return [
            [Markup.callbackButton(`🎧 ${language === 'ru' ? 'Платформы' : 'Platforms'}`, 'platforms')],
            [Markup.callbackButton(`${state.authorMode ? '✅' : '❌'} ${language === 'ru' ? 'Режим автора' : 'Author mode'}`, 'state:authorMode')],
            [Markup.callbackButton(`${state.annotations ? '✅' : '❌'}  ${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'state:annotations')],
            [Buttons.getBackButton(language), Buttons.getCloseButton(language)]
        ];
    }

    public static getHelpButtons(language: string = 'en'): CallbackButton[][] {
        return [
            [Markup.callbackButton(`${language === 'ru' ? 'Что это вообще?' : 'Annotations'}`, 'helpOption:0')],
            [Markup.callbackButton(`${language === 'ru' ? 'Список платформ' : 'Annotations'}`, 'helpOption:1')],
            [Markup.callbackButton(`${language === 'ru' ? 'Бот в группе или канале' : 'Annotations'}`, 'helpOption:2')],
            [Markup.callbackButton(`${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'helpOption:3')],
            [Buttons.getBackButton(language), Buttons.getCloseButton(language)]
        ];
    }

    public static getDonationsButtons(language: string = 'en'): (CallbackButton | UrlButton)[][] {
        return [
            [Markup.urlButton(`💵 Yandex Money`, process.env.YMONEY_URL)],
            [Markup.urlButton(`💳 Patreon`, process.env.PATREON_URL)],
            [Buttons.getBackButton(language), Buttons.getCloseButton(language)]
        ]
    }

    public static getLeaveSceneButton(language: string = 'en'): CallbackButton[] {
        return [Markup.callbackButton(`❌ ${language === 'ru' ? 'Отмена' : 'Cancel'}`, 'cancel')];
    }
}
