import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {Chat} from "./Chat";

@Entity()
export class Errors {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    error: string;

    @Column()
    functionCode: string;

    // @ManyToOne(type => Chat, chat => chat.errors)
    // chat: Chat;
}
