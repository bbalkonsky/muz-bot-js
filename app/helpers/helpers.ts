export default abstract class Helpers {
    public static isAdmin(chatId: string | number): boolean {
        return chatId.toString() === process.env.OWNER_ID;
    }
}
