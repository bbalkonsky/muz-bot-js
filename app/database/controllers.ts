import {getRepository} from "typeorm";
import {Chat} from "./entities/Chat";
import {ChatState} from "./entities/ChatState";
import {ChatPlatforms} from "./entities/ChatPlatforms";
import {Messages} from "./entities/Messages";

export default class DataBaseController {
    static async createChat(chatId, chatType, regDate): Promise<void> {
        const newChat = new Chat();
        newChat.id = chatId;
        newChat.chatType = chatType;
        newChat.registrationDate = regDate;

        const platforms = new ChatPlatforms();
        const state = new ChatState();

        newChat.platforms = platforms;
        newChat.state = state;

        await getRepository(Chat).save(newChat);
    }

    static async getChatPlatforms(chatId): Promise<ChatPlatforms> {
        const chat = await getRepository(Chat).findOne(chatId, {relations: ["platforms"]});
        delete chat.platforms.id;
        return chat.platforms;
    }

    static async toggleChatPlatform(chatId, platform: string): Promise<any> {
        const chat = await getRepository(Chat).findOne(chatId, {relations: ["platforms"]});
        chat.platforms[platform] = !chat.platforms[platform];
        await getRepository(Chat).save(chat);
        delete chat.platforms.id;
        return chat.platforms;
    }

    static async getChatState(chatId): Promise<ChatState> {
        const chat = await getRepository(Chat).findOne(chatId, {relations: ["state"]});
        return chat.state;
    }

    static async toggleChatState(chatId, state: string): Promise<any> {
        const chat = await getRepository(Chat).findOne(chatId, {relations: ["state"]});
        chat.state[state] = !chat.state[state];
        await getRepository(Chat).save(chat);
        return chat.state;
    }

    static async addMessageToLog(chatId: number, userMessage, messageType: "private" | "reply"): Promise<void> {
        const chatRepository = await getRepository(Chat);
        const chat = await chatRepository.findOne(chatId);

        const messageRepository = await getRepository(Messages);
        const message = new Messages();
        message.chat = chat;
        message.message = JSON.stringify(userMessage);
        message.messageType = messageType;

        messageRepository.save(message);
    }
}
