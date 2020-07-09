import IMessage from "./model/IMessage";

export const response: IMessage = {
    'content_type': 'text',
    'message_id': 1165,
    'from_user': {
        'id': 126017510,
        'is_bot': false,
        'first_name': 'b',
        'username': undefined,
        'last_name': undefined,
        'language_code': 'ru',
        'can_join_groups': undefined,
        'can_read_all_group_messages': undefined,
        'supports_inline_queries': undefined
    },
    'date': 1594223520,
    'chat': {
        'id': 126017510,
        'type': 'private',
        'title': undefined,
        'username': undefined,
        'first_name': 'b',
        'last_name': undefined,
        'all_members_are_administrators': undefined,
        'photo': undefined,
        'description': undefined,
        'invite_link': undefined,
        'pinned_message': undefined,
        'permissions': undefined,
        'slow_mode_delay': undefined,
        'sticker_set_name': undefined,
        'can_set_sticker_set': undefined
    },
    'forward_from': undefined,
    'forward_from_chat': undefined,
    'forward_from_message_id': undefined,
    'forward_signature': undefined,
    'forward_date': undefined,
    'reply_to_message': undefined,
    'edit_date': undefined,
    'media_group_id': undefined,
    'author_signature': undefined,
    'text': 'послушай эту вот песню https://open.spotify.com/track/6oaz82MzzilUXPVIlSmHbE?si=-4VYm0C9QeSpCgpLG6FlYA',
    'entities': undefined,
    'caption_entities': undefined,
    'audio': undefined,
    'document': undefined,
    'photo': undefined,
    'sticker': undefined,
    'video': undefined,
    'video_note': undefined,
    'voice': undefined,
    'caption': undefined,
    'contact': undefined,
    'location': undefined,
    'venue': undefined,
    'animation': undefined,
    'dice': undefined,
    'new_chat_member': undefined,
    'new_chat_members': undefined,
    'left_chat_member': undefined,
    'new_chat_title': undefined,
    'new_chat_photo': undefined,
    'delete_chat_photo': undefined,
    'group_chat_created': undefined,
    'supergroup_chat_created': undefined,
    'channel_chat_created': undefined,
    'migrate_to_chat_id': undefined,
    'migrate_from_chat_id': undefined,
    'pinned_message': undefined,
    'invoice': undefined,
    'successful_payment': undefined,
    'connected_website': undefined,
    'json': {
        'message_id': 1165,
        'from': {'id': 126017510, 'is_bot': false, 'first_name': 'b', 'language_code': 'ru'},
        'chat': {'id': 126017510, 'first_name': 'b', 'type': 'private'},
        'date': 1594223520,
        'text': 'sdfsdf'
    }
};

export const songResponse = '{\n' +
    '  "entityUniqueId": "SPOTIFY_SONG::6oaz82MzzilUXPVIlSmHbE",\n' +
    '  "userCountry": "US",\n' +
    '  "pageUrl": "https://song.link/s/6oaz82MzzilUXPVIlSmHbE",\n' +
    '  "entitiesByUniqueId": {\n' +
    '    "AMAZON_SONG::B07P761KYZ": {\n' +
    '      "id": "B07P761KYZ",\n' +
    '      "type": "song",\n' +
    '      "title": "Паук",\n' +
    '      "artistName": "Nikto",\n' +
    '      "thumbnailUrl": "https://m.media-amazon.com/images/I/61TLN6Xg7kL._AA500.jpg",\n' +
    '      "thumbnailWidth": 500,\n' +
    '      "thumbnailHeight": 500,\n' +
    '      "apiProvider": "amazon",\n' +
    '      "platforms": [\n' +
    '        "amazonMusic",\n' +
    '        "amazonStore"\n' +
    '      ]\n' +
    '    },\n' +
    '    "DEEZER_SONG::642532112": {\n' +
    '      "id": "642532112",\n' +
    '      "type": "song",\n' +
    '      "title": "Паук",\n' +
    '      "artistName": "Nikto",\n' +
    '      "thumbnailUrl": "https://cdns-images.dzcdn.net/images/cover/d9d0d60f9900c7b8aff2cd7a9ead19e3/500x500-000000-80-0-0.jpg",\n' +
    '      "thumbnailWidth": 500,\n' +
    '      "thumbnailHeight": 500,\n' +
    '      "apiProvider": "deezer",\n' +
    '      "platforms": [\n' +
    '        "deezer"\n' +
    '      ]\n' +
    '    },\n' +
    '    "GOOGLE_SONG::Tzvsum3heseuwornp6rta5uhoga": {\n' +
    '      "id": "Tzvsum3heseuwornp6rta5uhoga",\n' +
    '      "type": "song",\n' +
    '      "title": "Паук",\n' +
    '      "artistName": "Nikto",\n' +
    '      "thumbnailUrl": "https://lh3.googleusercontent.com/DLEPuG38JjnOmeOZsOP2DBVR6pasb0p6_q08sBxmvQ0ojn4hpuHABxkdY0W1yiqlKFjLtpmSAw",\n' +
    '      "thumbnailWidth": 512,\n' +
    '      "thumbnailHeight": 512,\n' +
    '      "apiProvider": "google",\n' +
    '      "platforms": [\n' +
    '        "google",\n' +
    '        "googleStore"\n' +
    '      ]\n' +
    '    },\n' +
    '    "ITUNES_SONG::1456473251": {\n' +
    '      "id": "1456473251",\n' +
    '      "type": "song",\n' +
    '      "title": "Паук",\n' +
    '      "artistName": "Nikto",\n' +
    '      "thumbnailUrl": "https://is5-ssl.mzstatic.com/image/thumb/Music113/v4/5e/bd/69/5ebd6977-d19f-b882-8c05-e7ae17514598/source/512x512bb.jpg",\n' +
    '      "thumbnailWidth": 512,\n' +
    '      "thumbnailHeight": 512,\n' +
    '      "apiProvider": "itunes",\n' +
    '      "platforms": [\n' +
    '        "appleMusic",\n' +
    '        "itunes"\n' +
    '      ]\n' +
    '    },\n' +
    '    "SPOTIFY_SONG::6oaz82MzzilUXPVIlSmHbE": {\n' +
    '      "id": "6oaz82MzzilUXPVIlSmHbE",\n' +
    '      "type": "song",\n' +
    '      "title": "Паук",\n' +
    '      "artistName": "Nikto",\n' +
    '      "thumbnailUrl": "https://i.scdn.co/image/ab67616d0000b273ad47eb37aa3ff2a1befc783f",\n' +
    '      "thumbnailWidth": 640,\n' +
    '      "thumbnailHeight": 640,\n' +
    '      "apiProvider": "spotify",\n' +
    '      "platforms": [\n' +
    '        "spotify"\n' +
    '      ]\n' +
    '    },\n' +
    '    "TIDAL_SONG::105116138": {\n' +
    '      "id": "105116138",\n' +
    '      "type": "song",\n' +
    '      "title": "Паук",\n' +
    '      "artistName": "Nikto",\n' +
    '      "thumbnailUrl": "https://resources.tidal.com/images/c1738f3e/81fd/41fe/b41b/9cd6e4d412c8/640x640.jpg",\n' +
    '      "thumbnailWidth": 640,\n' +
    '      "thumbnailHeight": 640,\n' +
    '      "apiProvider": "tidal",\n' +
    '      "platforms": [\n' +
    '        "tidal"\n' +
    '      ]\n' +
    '    },\n' +
    '    "YANDEX_SONG::50728702": {\n' +
    '      "id": "50728702",\n' +
    '      "type": "song",\n' +
    '      "title": "Паук",\n' +
    '      "artistName": "Nikto",\n' +
    '      "thumbnailUrl": "https://avatars.yandex.net/get-music-content/139444/183cdae4.a.7028624-1/600x600",\n' +
    '      "thumbnailWidth": 600,\n' +
    '      "thumbnailHeight": 600,\n' +
    '      "apiProvider": "yandex",\n' +
    '      "platforms": [\n' +
    '        "yandex"\n' +
    '      ]\n' +
    '    }\n' +
    '  },\n' +
    '  "linksByPlatform": {\n' +
    '    "amazonMusic": {\n' +
    '      "url": "https://music.amazon.com/albums/B07P897RNQ?trackAsin=B07P761KYZ&do=play",\n' +
    '      "entityUniqueId": "AMAZON_SONG::B07P761KYZ"\n' +
    '    },\n' +
    '    "amazonStore": {\n' +
    '      "url": "https://amazon.com/dp/B07P761KYZ?tag=songlink0d-20",\n' +
    '      "entityUniqueId": "AMAZON_SONG::B07P761KYZ"\n' +
    '    },\n' +
    '    "deezer": {\n' +
    '      "url": "https://www.deezer.com/track/642532112",\n' +
    '      "entityUniqueId": "DEEZER_SONG::642532112"\n' +
    '    },\n' +
    '    "google": {\n' +
    '      "url": "https://play.google.com/music/m/Tzvsum3heseuwornp6rta5uhoga?signup_if_needed=1",\n' +
    '      "entityUniqueId": "GOOGLE_SONG::Tzvsum3heseuwornp6rta5uhoga"\n' +
    '    },\n' +
    '    "googleStore": {\n' +
    '      "url": "https://play.google.com/store/music/album?id=Bgmbj65xwp3oqcrd6yb4tgru2cm&tid=song-Tzvsum3heseuwornp6rta5uhoga",\n' +
    '      "entityUniqueId": "GOOGLE_SONG::Tzvsum3heseuwornp6rta5uhoga"\n' +
    '    },\n' +
    '    "appleMusic": {\n' +
    '      "url": "https://geo.music.apple.com/us/album/_/1456473248?i=1456473251&mt=1&app=music&at=1000lHKX",\n' +
    '      "nativeAppUriMobile": "music://itunes.apple.com/us/album/_/1456473248?i=1456473251&mt=1&app=music&at=1000lHKX",\n' +
    '      "nativeAppUriDesktop": "itmss://itunes.apple.com/us/album/_/1456473248?i=1456473251&mt=1&app=music&at=1000lHKX",\n' +
    '      "entityUniqueId": "ITUNES_SONG::1456473251"\n' +
    '    },\n' +
    '    "itunes": {\n' +
    '      "url": "https://geo.music.apple.com/us/album/_/1456473248?i=1456473251&mt=1&app=itunes&at=1000lHKX",\n' +
    '      "nativeAppUriMobile": "itmss://itunes.apple.com/us/album/_/1456473248?i=1456473251&mt=1&app=itunes&at=1000lHKX",\n' +
    '      "nativeAppUriDesktop": "itmss://itunes.apple.com/us/album/_/1456473248?i=1456473251&mt=1&app=itunes&at=1000lHKX",\n' +
    '      "entityUniqueId": "ITUNES_SONG::1456473251"\n' +
    '    },\n' +
    '    "spotify": {\n' +
    '      "url": "https://open.spotify.com/track/6oaz82MzzilUXPVIlSmHbE",\n' +
    '      "nativeAppUriDesktop": "spotify:track:6oaz82MzzilUXPVIlSmHbE",\n' +
    '      "entityUniqueId": "SPOTIFY_SONG::6oaz82MzzilUXPVIlSmHbE"\n' +
    '    },\n' +
    '    "tidal": {\n' +
    '      "url": "https://listen.tidal.com/track/105116138",\n' +
    '      "entityUniqueId": "TIDAL_SONG::105116138"\n' +
    '    },\n' +
    '    "yandex": {\n' +
    '      "url": "https://music.yandex.ru/track/50728702",\n' +
    '      "entityUniqueId": "YANDEX_SONG::50728702"\n' +
    '    }\n' +
    '  }\n' +
    '}\n';

