import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {Chat} from "./Chat";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    messageType: string;

    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Chat;
}
