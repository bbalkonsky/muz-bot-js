import {Entity, Column, OneToOne, JoinColumn, OneToMany, PrimaryColumn} from "typeorm";
import {ChatPlatforms} from "./ChatPlatforms";
import {ChatState} from "./ChatState";
import {Messages} from "./Messages";

@Entity()
export class Chat {
    @PrimaryColumn({
        unique: true
    })
    id: number;

    @Column()
    chatType: string;

    @Column({type: 'date'})
    registrationDate: number;

    @OneToOne(() => ChatPlatforms, {
        cascade: true,
    })
    @JoinColumn()
    platforms: ChatPlatforms;

    @OneToOne(() => ChatState, {
        cascade: true,
    })
    @JoinColumn()
    state: ChatState;

    @OneToMany(() => Messages, messages => messages.chat, {
        cascade: true,
    })
    messages: Messages[];
}
