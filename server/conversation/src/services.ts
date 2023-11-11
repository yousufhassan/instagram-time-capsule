import { log } from "console";
import { getChatDataFromFile } from "../../chat/src/services";
import { Message } from "../../cdk-common/layers/logic/nodejs/types";
import { getAllMessages, getFormattedDate } from "../../cdk-common/layers/logic/nodejs/services";
import { MultipartFile } from "lambda-multipart-parser";

export const getConversationDateFromRequest = (request: any): string => {
    return request.date;
};

export const logConversationInserted = (numConversations: number): void => {
    log(`--- ${numConversations} conversations inserted into database ---`);
};

export const logConversationDoesNotExist = (): void => {
    log("--- Conversation does not exist in DB ---");
};

export const logConversationFound = (): void => {
    log("--- Conversation found in DB ---");
};

export const getConversationsFromFiles = (files: MultipartFile[]): Map<string, Message[]> => {
    // const unlinkAsync = promisify(fs.unlink);
    let conversations = new Map<string, Message[]>();

    files.forEach(async (file: MultipartFile) => {
        const chatData = getChatDataFromFile(file);
        const messages = getAllMessages(chatData);
        organizeMessagesIntoConversations(messages, conversations);
        // await unlinkAsync(file.path); // Delete file from server
    });

    return conversations;
};

const organizeMessagesIntoConversations = (messages: Message[], conversations: Map<string, Message[]>): void => {
    messages.forEach((message: Message) => {
        const date = new Date(message.timestamp_ms);
        const formattedDate = getFormattedDate(date);
        if (conversations.has(formattedDate)) {
            conversations.get(formattedDate)!.push(message);
        } else {
            conversations.set(formattedDate, [message]);
        }
    });
};
