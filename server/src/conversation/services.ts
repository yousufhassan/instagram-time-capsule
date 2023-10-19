import { log } from "console";
import { Request } from "express";
import { getChatDataFromFile } from "../chat/services.js";
import { Message } from "../types.js";
import { getAllMessages, getFormattedDate } from "../common/services.js";
import { promisify } from "util";
import * as fs from "fs";

export const getConversationDateFromRequest = (request: Request): string => {
    return request.body.date;
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

export const getConversationsFromFiles = (files: Express.Multer.File[]): Map<string, Message[]> => {
    const unlinkAsync = promisify(fs.unlink);
    let conversations = new Map<string, Message[]>();

    files.forEach(async (file: Express.Multer.File) => {
        const chatData = getChatDataFromFile(file);
        const messages = getAllMessages(chatData);
        organizeMessagesIntoConversations(messages, conversations);
        await unlinkAsync(file.path); // Delete file from server
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
