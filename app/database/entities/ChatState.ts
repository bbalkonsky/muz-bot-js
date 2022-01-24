import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ChatState {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    authorMode: boolean;

    @Column({ default: true })
    annotations: boolean;
}
