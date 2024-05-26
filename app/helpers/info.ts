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
}
