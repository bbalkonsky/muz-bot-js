import {PlatformList} from "../models/platform-list";

export default class Info {
    static platforms: PlatformList = {
        spotify: {alias: 'Spotify', link: 'spotify.com'},
        appleMusic: {alias: 'Apple Music', link: 'music.apple.com'},
        youtube: {alias: 'YouTube', link: 'youtube.com'},
        yandex: {alias: 'Yandex Music', link: 'music.yandex.ru'},
        youtubeMusic: {alias: 'YouTube Music', link: 'music.youtube.com'},
        deezer: {alias: 'Deezer', link: 'deezer.com'},
        soundcloud: {alias: 'SoundCloud', link: 'soundcloud.com'},
        // google: {alias: 'Google Play', link: 'play.google.com'},
        tidal: {alias: 'Tidal', link: 'tidal.com'},
        // 'pandora': {alias: 'Pandora', link: 'pandora.com'},
        // 'napster': {alias: 'Napster', link: 'napster.com'},
        // 'fanburst': {alias: 'Fanburst', link: 'fanburst.com'},
        vk: {alias: 'VKontakte', link: ''},
        // 'amazonMusic': {alias: 'Amazon Music', link: 'music.amazon.com'},
        // 'spinrilla': {alias: 'Spinrilla', link: 'spinrilla.com'}
    };

    static instRu = {
            0: 'Просто отправь Боту ссылку на песню (или музыкальное видео из YouTube) из своего ' +
                'любимого музыкального сервиса',
            1: 'Ты можешь изменить список платформ для отображения во вкладке "Платформы" (нет, это не шутка)',
            2: 'Если Бот добавлен в группу или канал, он будет удалять сообщение, на которое отвечает, если ему ' +
                'предоставить права администратора (отметки "Все пользователи являются администраторами" недостаточно)' +
                '\nP.S. Сразу отвечу: нет, бот не логирует все сообщения и нет, никто их не отправялет товарищу майору, ' +
                'это же не сервис от Яндекс ¯\\_(ツ)_/¯',
            3: 'Опция "Аннотации" отвечает за отображение текста, введенного перед ссылкой на песню'
        }
}
