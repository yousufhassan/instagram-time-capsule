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
    getChatDataFromFile,
    getChatOwnerFromRequest,
    getChatTitleFromChatData,
    getFilesFromRequest,
    logChatDoesNotExist,
} from "../../services/chats.js";
import { getUserIdFromUsername } from "../core.js";
import { deleteChat, doesChatExist, insertChatToDB } from "./chats.js";
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
        const chatData = getChatDataFromFile(files[0]);
        const chatTitle = getChatTitleFromChatData(chatData);

        await deleteOldChatIfExists(client, chatOwnerId, chatTitle);
        const [chatId, chatImageColor] = await insertChatToDB(client, chatOwnerId, chatTitle);

        // @ts-ignore Same as above
        const numMessages = await insertAllConversationsFromUploadIntoDB(client, files, chatId);
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

export const insertAllConversationsFromUploadIntoDB = async (
    client: PoolClient,
    files: Express.Multer.File[],
    chatId: string
): Promise<number> => {
    const unlinkAsync = promisify(fs.unlink);
    let numConversations = 0;
    let numMessages = 0;

    files.forEach(async (file: Express.Multer.File) => {
        const chatData = getChatDataFromFile(file);
        const messages = getAllMessages(chatData);
        const conversationMap = splitConversationsByDay(messages);
        log(conversationMap.keys());

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

// let chatId = chatIdAndColor[0];
// let bgColor = chatIdAndColor[1];
// // Get all conversations from this file upload and store in the database
// console.log("Chat ID: " + chatId);
// let numMessages = 0; // Tracks how many messages were sent in this chat

// files.forEach(async (file: any) => {
//     // let chatData = require(file.path);
//     let messages = getAllMessages(chatData);
//     let conversationsMap = splitConversationsByDay(messages);

//     conversationsMap.forEach(async (conversation, date) => {
//         numMessages += conversation.length;
//         let conversationId = await db.addConversation(
//             connection,
//             chatId,
//             date,
//             JSON.stringify(conversation),
//             conversation.length
//         );
//         console.log("Conversation ID: " + conversationId);
//     });

//     // Delete file from server
//     await unlinkAsync(file.path);

//     // res.send()
// });
