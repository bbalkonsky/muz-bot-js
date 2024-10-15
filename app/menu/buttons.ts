import { Markup } from 'telegraf';
import { CallbackButton } from 'telegraf/typings/markup';
import { ChatPlatforms } from '../database/entities/ChatPlatforms';
import Helpers from '../helpers/helpers';
import Info from '../helpers/info';


const labels = {
    backButton: { en: 'Back', ru: 'Назад' },
    closeButton: { en: 'Close', ru: 'Закрыть' },
    settings: { en: 'Chat settings', ru: 'Настройки' },
    help: { en: 'Get help', ru: 'Помощь' },
    donate: { en: 'Donate', ru: 'Поддержать' },
    contacts: { en: 'Contacts', ru: 'Написать автору' },
    platforms: { en: 'Platforms', ru: 'Платформы' },
    authorMode: { en: 'Author mode', ru: 'Режим автора' },
    annotations: { en: 'Annotations', ru: 'Аннотации' }
};

const getLabel = (key, language = 'en') => labels[key][language] || labels[key].en;

const createButton = (name, status, language, prefix = '', labelInfo = {}): CallbackButton => {
    const emoji = status ? '✅' : '❌';
    const label = getLabel(name, language) || labelInfo[language].alias;
    return Markup.callbackButton(`${emoji} ${label}`, `${prefix}:${name}`);
};

const getBackButton = (language: string = 'en'): CallbackButton => {
    return Markup.callbackButton(`◀ ${language === 'ru' ? 'Назад' : 'Back'}`, 'back');
}

const getCloseButton = (language: string = 'en'): CallbackButton => {
    return Markup.callbackButton(`⏹ ${language === 'ru' ? 'Закрыть' : 'Close'}`, 'close');
}

const getPlatformsButtons = (chatPlatforms: ChatPlatforms, language = 'en'): CallbackButton[][] => {
    const cols = 3;
    const buttons = [];
    Object.keys(chatPlatforms)
      .filter(platform => chatPlatforms.hasOwnProperty(platform))
      .forEach((platform, index) => {
          const isColumnEnd = (index + 1) % cols === 0;
          const newButton = Markup.callbackButton(
              `${chatPlatforms[platform] ? '✅' : '❌'} ${Info.platforms[platform].alias}`, `platform:${platform}`
          );

          if (isColumnEnd) {
              buttons.push([newButton]);
          }
          else {
              buttons.push([newButton]);
          }
      });
    buttons.push([
        getBackButton(language),
        getCloseButton(language)
    ]);
    return buttons;
};

const getMainMenuButtons = (ctx): CallbackButton[][] => {
    const language = ctx.from?.language_code ?? 'en';
    return [
        [Markup.callbackButton(`⚙ ${language === 'ru' ? 'Настройки' : 'Chat settings'}`, 'settings')],
        [Markup.callbackButton(`⁉ ${language === 'ru' ? 'Помощь' : 'Get help'}`, 'help')],
        [Markup.callbackButton(`⭐️ ${language === 'ru' ? 'Поддержать' : 'Donate'}`, 'donate')],
        [Markup.callbackButton(`✏ ${language === 'ru' ? 'Задать вопрос' : 'Feedback'}`, 'ask')],
        [getCloseButton()]
    ];
};

const getSettingsButtons = (state, language = 'en'): CallbackButton[][] => [
    [Markup.callbackButton(`🎧 ${language === 'ru' ? 'Платформы' : 'Platforms'}`, 'platforms')],
    [Markup.callbackButton(`${state.authorMode ? '✅' : '❌'} ${language === 'ru' ? 'Читать сообщения' : 'Read messages'}`, 'state:authorMode')],
    [Markup.callbackButton(`${state.annotations ? '✅' : '❌'}  ${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'state:annotations')],
    [getBackButton(language), getCloseButton(language)]

];

const getHelpButtons = (language: string = 'en'): CallbackButton[][] => {
    return [
        [Markup.callbackButton(`${language === 'ru' ? 'Что это вообще?' : 'What the bot?'}`, 'helpOption:0')],
        [Markup.callbackButton(`${language === 'ru' ? 'Задать вопрос' : 'Feedback'}`, 'helpOption:5')],
        [Markup.callbackButton(`${language === 'ru' ? 'Список платформ' : 'Platforms'}`, 'helpOption:1')],
        [Markup.callbackButton(`${language === 'ru' ? 'Бот в группе или канале' : 'Bot for groups and channels'}`, 'helpOption:2')],
        [Markup.callbackButton(`${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'helpOption:3')],
        [Markup.callbackButton(`${language === 'ru' ? 'Читать сообщения' : 'Read messages'}`, 'helpOption:4')],
        [getBackButton(language), getCloseButton(language)]
    ];
};

const getDonateButtons = (language: string = 'en'): CallbackButton[][] => {
    return [
        [Markup.callbackButton('100 ⭐', 'donateOption:100')],
        [Markup.callbackButton('1 ⭐', 'donateOption:1')],
        [Markup.callbackButton('200 🍺', 'donateOption:200')],
        [Markup.callbackButton('500 🍾', 'donateOption:500')],
        [Markup.callbackButton('1000 🤩', 'donateOption:1000')],
        [getBackButton(language), getCloseButton(language)]
    ];
};

const getLeaveSceneButton = (language = 'en'): CallbackButton[] => [createButton('cancel', true, language)];

export {
    getPlatformsButtons,
    getMainMenuButtons,
    getSettingsButtons,
    getHelpButtons,
    getLeaveSceneButton,
    getDonateButtons
};
