import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, PrimaryColumn} from "typeorm";
import {ChatPlatforms} from "./ChatPlatforms";
import {ChatState} from "./ChatState";
import {Messages} from "./Messages";
import {Errors} from "./Errors";

@Entity()
export class Chat {
    // @PrimaryGeneratedColumn()
    // id: number;

    @PrimaryColumn({
        unique: true
    })
    id: number;

    @Column()
    chatType: string;

    @Column({type: 'date'})
    registrationDate: number;

    @OneToOne(type => ChatPlatforms, {
        cascade: true,
    })
    @JoinColumn()
    platforms: ChatPlatforms;

    @OneToOne(type => ChatState, {
        cascade: true,
    })
    @JoinColumn()
    state: ChatState;

    @OneToMany(type => Messages, messages => messages.chat, {
        cascade: true,
    })
    messages: Messages[];

    // @OneToMany(type => Errors, errors => errors.chat, {
    //     cascade: true,
    // })
    // errors: Errors[];
}
