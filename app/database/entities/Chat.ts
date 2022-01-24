import {Entity, Column, OneToOne, JoinColumn, PrimaryColumn} from "typeorm";
import {ChatPlatforms} from "./ChatPlatforms";
import {ChatState} from "./ChatState";

@Entity()
export class Chat {
    @PrimaryColumn({
        unique: true
    })
    id: number;

    @Column()
    chatType: string;

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
}
