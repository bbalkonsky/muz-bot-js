import {PlatformList} from "../models/platform-list";

export default class Info {
    static platforms: PlatformList = {
        spotify: {
            alias: 'Spotify',
            link: ['spotify.com']
        },
        appleMusic: {
            alias: 'Apple Music',
            link: ['music.apple.com', 'itunes.apple.com']
        },
        yandex: {
            alias: 'Yandex Music',
            link: ['music.yandex']
        },
        youtubeMusic: {
            alias: 'YouTube Music',
            link: ['music.youtube.com']
        },
        youtube: {
            alias: 'YouTube',
            link: ['youtube.com', 'youtu.be']
        },
        deezer: {
            alias: 'Deezer',
            link: ['deezer.com', 'deezer.page.link']
        },
        soundcloud: {
            alias: 'SoundCloud',
            link: ['soundcloud.com']
        },
        tidal: {
            alias: 'Tidal',
            link: ['tidal.com']
        },
        vk: {
            alias: 'VKontakte',
            link: ['vkontakte.ru']
        },
        // 'pandora': {alias: 'Pandora', link: 'pandora.com'},
        // 'napster': {alias: 'Napster', link: 'napster.com'},
        // 'fanburst': {alias: 'Fanburst', link: 'fanburst.com'},
        // 'amazonMusic': {alias: 'Amazon Music', link: 'music.amazon.com'},
        // 'spinrilla': {alias: 'Spinrilla', link: 'spinrilla.com'}
    };

    static instRu = {
        0: 'Просто отправь Боту ссылку на песню (или музыкальное видео из YouTube) из своего ' +
            'любимого музыкального сервиса',
        1: 'Ты можешь изменить список платформ для отображения в ответе Бота во вкладке "Платформы"',
        2: 'Если Бот добавлен в группу или канал, он будет отвечать на ссылки и удалять сообщение, на которое отвечает, если ему ' +
            'предоставить права администратора (отметки "Все пользователи являются администраторами" недостаточно)' +
            '\nБот не собирает и не хранит сообщения',
        3: 'Опция "Аннотации" отвечает за отображение текста, введенного перед ссылкой на песню',
        4: 'Кнопка "Читать сообщения" может выключить возможность Бота читать все сообщения и автоматически отвечать на них' +
            'в каналах и группах',
        5: 'Чтобы написать администратору, начни свое сообщение с команды /ask' +
            '\nСообщение будет переслано, но если у тебя закрытый аккаунт, ответить тебе не получится'
    }

    static instEn = {
        0: 'Just send the Bot a link to a song (or music video from YouTube) from your favorite music service.',
        1: 'You can change the list of platforms displayed in the Bot\'s response in the \'Platforms\' tab.',
        2: 'If the Bot is added to a group or channel, it will respond to links and delete the message it replies to ' +
            'if it is granted administrator rights (the \'All users are administrators\' option is not enough). ' +
            'The Bot does not collect or store messages.',
        3: 'The \'Annotations\' option controls the display of text entered before the song link.',
        4: 'The \'Read messages\' button can disable the Bot\'s ability to read all messages and automatically respond ' +
            'to them in channels and groups.',
        5: 'To write to the administrator, start your message with the /ask command. ' +
            'The message will be forwarded, but if you have a private account, it won\'t be possible to reply to you.'
    }
}
