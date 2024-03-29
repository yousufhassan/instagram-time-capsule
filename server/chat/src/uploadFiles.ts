// import { Request } from "express";
import { Pool, PoolClient } from "pg";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../../cdk-common/layers/logic/nodejs/database";
import {
    getChatDataFromFile,
    getChatOwnerFromRequest,
    getChatTitleFromChatData,
    getFilesFromRequest,
    logChatDoesNotExist,
} from "./services";
import { getUserIdFromUsername } from "../../cdk-common/layers/logic/nodejs/services";
import { deleteChat, doesChatExist, insertChatToDB } from "./chatList";
import { insertConversationIntoDB } from "../../conversation/getConversation";
import { Message } from "../../cdk-common/layers/logic/nodejs/types";
import { getConversationsFromFiles, logConversationInserted } from "../../conversation/services";
import { log } from "console";

// TODO: change request type from 'any' to 'MultipartRequest'
export const uploadFiles = async (pool: Pool, request: any): Promise<Object> => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const files = getFilesFromRequest(request);
        const chatOwner = getChatOwnerFromRequest(request); // aka: the logged in user.
        const chatOwnerId = await getUserIdFromUsername(client, chatOwner);

        if (!chatOwnerId) throw { message: "ERROR: chatOwnerId was undefined", statuscode: 401 };

        // @ts-ignore An error to do with unmatched types from the request.files
        // Come back to solve later, but for now it seems to work.
        const chatData = getChatDataFromFile(files[0]);
        const chatTitle = getChatTitleFromChatData(chatData);

        // await deleteOldChatIfExists(client, chatOwnerId, chatTitle);
        let chatId, chatImageColor;
        const chat = await doesChatExist(client, chatOwnerId, chatTitle);
        if (chat !== undefined) {
            chatId = chat.chat_id;
            chatImageColor = chat.bg_color;
        } else {
            [chatId, chatImageColor] = await insertChatToDB(client, chatOwnerId, chatTitle);
        }

        // @ts-ignore Same as above
        const conversations = getConversationsFromFiles(files);
        const numMessages = await insertAllConversationsFromUploadIntoDB(client, conversations, chatId);
        await commitTransaction(client);
        return sendUploadFilesResponse(chatId, chatTitle, numMessages, chatImageColor);
    } catch (error: any) {
        await rollbackTransaction(client);
        log(error);
        return error;
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
    conversations: Map<string, Message[]>,
    chatId: string
): Promise<number> => {
    let numConversations = 0;
    let numMessages = 0;

    conversations.forEach(async (conversation, date) => {
        numConversations++;
        numMessages += conversation.length;
        await insertConversationIntoDB(client, chatId, date, conversation);
    });

    logConversationInserted(numConversations);
    return numMessages;
};

const sendUploadFilesResponse = (chatId: string, chatTitle: string, numMessages: number, chatImageColor: string) => {
    return { chatId: chatId, chatTitle: chatTitle, numMessages: numMessages, bgColor: chatImageColor };
};
