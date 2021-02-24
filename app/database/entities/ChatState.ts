import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ChatState {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    annotations: boolean;

    @Column({ default: false })
    quiet: boolean;

    @Column({ default: false })
    rating: boolean;
}
