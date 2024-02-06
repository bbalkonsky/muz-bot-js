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

const getPlatformsButtons = (chatPlatforms: ChatPlatforms, language = 'en'): CallbackButton[][] => {
    const cols = 3;
    const buttons = Object.keys(chatPlatforms)
      .filter(platform => chatPlatforms.hasOwnProperty(platform))
      .map((platform, index) => {
          const isColumnEnd = (index + 1) % cols === 0;
          const newButton = createButton(platform, chatPlatforms[platform], language, 'platform', Info.platforms);
          return isColumnEnd ? [newButton] : newButton;
      });
    buttons.push([
        createButton('back', true, language),
        createButton('close', true, language)
    ]);
    return buttons;
};

const getMainMenuButtons = (ctx): CallbackButton[][] => {
    const language = ctx.from?.language_code ?? 'en';
    return [
        [createButton('settings', true, language)],
        [createButton('help', true, language)],
        [createButton('contacts', true, language)],
        [Markup.callbackButton('🤔 Сказать всем', 'notify', !Helpers.isAdmin(ctx.chat.id))],
        [createButton('close', true, language)]
    ];
};

const getSettingsButtons = (state, language = 'en'): CallbackButton[][] => [
    [createButton('platforms', true, language)],
    [createButton('authorMode', state.authorMode, language, 'state')],
    [createButton('annotations', state.annotations, language, 'state')],
    [createButton('back', true, language), createButton('close', true, language)]
];

const getHelpButtons = (language: string = 'en'): CallbackButton[][] => {
    return [
        [Markup.callbackButton(`${language === 'ru' ? 'Что это вообще?' : 'Annotations'}`, 'helpOption:0')],
        [Markup.callbackButton(`${language === 'ru' ? 'Список платформ' : 'Annotations'}`, 'helpOption:1')],
        [Markup.callbackButton(`${language === 'ru' ? 'Бот в группе или канале' : 'Annotations'}`, 'helpOption:2')],
        [Markup.callbackButton(`${language === 'ru' ? 'Аннотации' : 'Annotations'}`, 'helpOption:3')],
        [Buttons.getBackButton(language), Buttons.getCloseButton(language)]
    ];
};

const getLeaveSceneButton = (language = 'en'): CallbackButton[] => [createButton('cancel', true, language)];

export {
    getPlatformsButtons,
    getMainMenuButtons,
    getSettingsButtons,
    getHelpButtons,
    getLeaveSceneButton
};
