import { log } from "console";
import { Request, Response } from "express";
import { Pool, PoolClient } from "pg";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../database.js";
import {
    getChatDataFromFiles,
    getChatOwnerFromRequest,
    getChatTitleFromChatData,
    getFilesFromRequest,
    logChatDoesNotExist,
} from "../../services/chats.js";
import { getUserIdFromUsername } from "../core.js";
import { deleteChat, doesChatExist, insertChatToDB } from "./chats.js";
import { ChatData } from "../../types.js";
import { insertConversationIntoDB } from "../conversations/conversations.js";
import { getAllMessages, splitConversationsByDay } from "../../services/messages.js";
import * as fs from "fs";
import { promisify } from "util";
import { logConversationInserted } from "../../services/conversations.js";

// @ts-ignore
export const uploadFiles = async (pool: Pool, request: Request, response: Response): Promise<void> => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const files = getFilesFromRequest(request);
        const chatOwner = getChatOwnerFromRequest(request); // aka: the logged in user.
        const chatOwnerId = await getUserIdFromUsername(client, chatOwner);

        // @ts-ignore An error to do with unmatched types from the request.files
        // Come back to solve later, but for now it seems to work.
        const chatData = getChatDataFromFiles(files);
        const chatTitle = getChatTitleFromChatData(chatData);

        await deleteOldChatIfExists(client, chatOwnerId, chatTitle);
        const [chatId, chatImageColor] = await insertChatToDB(client, chatOwnerId, chatTitle);

        // TODO: Implement from line 140 onwards (app.ts file)
        // @ts-ignore Same as above
        const numMessages = insertAllConversationsFromUploadIntoDB(client, files, chatData, chatId);
        response.json({
            chatId: chatId,
            chatTitle: chatTitle,
            numMessages: numMessages,
            bgColor: chatImageColor,
        });
        await commitTransaction(client);
    } catch (error: unknown) {
        await rollbackTransaction(client);
        log(error);
    } finally {
        releasePoolClient(client);
    }
};

export const deleteOldChatIfExists = async (
    client: PoolClient,
    chatOwnerId: string,
    chatTitle: string
): Promise<void> => {
    const oldChatExists = await doesChatExist(client, chatOwnerId, chatTitle);
    if (oldChatExists) {
        await deleteChat(client, chatOwnerId, chatTitle);
    } else {
        logChatDoesNotExist();
    }
};

export const insertAllConversationsFromUploadIntoDB = (
    client: PoolClient,
    files: Express.Multer.File[],
    chatData: ChatData,
    chatId: string
): number => {
    const unlinkAsync = promisify(fs.unlink);
    let numConversations = 0;
    let numMessages = 0;

    files.forEach(async (file: Express.Multer.File) => {
        const messages = getAllMessages(chatData);
        const conversationMap = splitConversationsByDay(messages);

        conversationMap.forEach(async (conversation, date) => {
            numConversations++;
            numMessages += conversation.length;
            await insertConversationIntoDB(client, chatId, date, conversation);
        });
        await unlinkAsync(file.path); // Delete file from server
    });

    logConversationInserted(numConversations);
    return numMessages;
};
