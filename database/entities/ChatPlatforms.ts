import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ChatPlatforms {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    appleMusic: boolean;

    @Column({ default: true })
    spotify: boolean;

    @Column({ default: true })
    youtube: boolean;

    @Column({ default: true })
    yandex: boolean;

    @Column({ default: true })
    youtubeMusic: boolean;

    @Column({ default: true })
    deezer: boolean;

    @Column({ default: true })
    soundcloud: boolean;

    // @Column({ default: true })
    // google: boolean;

    @Column({ default: true })
    tidal: boolean;

    @Column({ default: true })
    vk: boolean;
}
