import { Request } from "express";
import { Pool, PoolClient } from "pg";
import { getUserIdFromUsername } from "../../cdk-common/layers/logic/nodejs/services";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../../cdk-common/layers/logic/nodejs/database";
import { log } from "console";
import { getChatImageColor, getUsernameFromRequest, logChatDeleted, logChatInserted } from "./services";
import { Chat } from "../../cdk-common/layers/logic/nodejs/types";

export const getChatList = async (pool: Pool, request: Request): Promise<Object> => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const username = getUsernameFromRequest(request);
        const userId = await getUserIdFromUsername(client, username);
        if (!userId) throw { message: "ERROR: userId was undefined", statusCode: 401 };
        const chatList = await getChatListFromUserId(client, userId);
        await commitTransaction(client);
        return chatList;
    } catch (error: any) {
        await rollbackTransaction(client);
        log(error);
        return error;
    } finally {
        releasePoolClient(client);
    }
};

// TODO: Figure out the return type of chatList and then create a named Type for it, if necessary.
export const getChatListFromUserId = async (client: PoolClient, userId: string) => {
    const getChatsFromUserIdQuery = `SELECT C1.chat_id, title, sum(num_messages) AS num_messages, C1.bg_color
                                     FROM chats C1, conversations C2
                                     WHERE C1.chat_id = C2.chat_id AND
                                         C1.chat_owner_id = $1
                                     GROUP BY C1.chat_id`;
    const queryResult = await client.query(getChatsFromUserIdQuery, [userId]);
    const chatList = queryResult.rows;
    return chatList;
};

export const doesChatExist = async (
    client: PoolClient,
    chatOwnerId: string,
    chatTitle: string
): Promise<Chat | undefined> => {
    const findChatQuery = "SELECT * FROM Chats WHERE chat_owner_id = $1 and title = $2";
    const queryResult = await client.query(findChatQuery, [chatOwnerId, chatTitle]);
    return queryResult.rowCount === 1
        ? {
              chat_id: queryResult.rows[0].chat_id,
              chat_owner_id: queryResult.rows[0].chat_owner_id,
              title: queryResult.rows[0].title,
              bg_color: queryResult.rows[0].bg_color,
          }
        : undefined;
};

export const deleteChat = async (client: PoolClient, chatOwnerId: string, chatTitle: string): Promise<void> => {
    const deleteChatQuery = "DELETE FROM Chats WHERE chat_owner_id = $1 and title = $2";
    await client.query(deleteChatQuery, [chatOwnerId, chatTitle]);
    logChatDeleted();
};

export const insertChatToDB = async (client: PoolClient, chatOwnerId: string, chatTitle: string): Promise<string[]> => {
    const insertChatQuery = "INSERT INTO Chats(chat_owner_id, title, bg_color) VALUES ($1,$2,$3)";
    const chatImageColor = getChatImageColor();
    await client.query(insertChatQuery, [chatOwnerId, chatTitle, chatImageColor]);
    const chatId = await getChatId(client, chatOwnerId, chatTitle);
    logChatInserted();
    return [chatId, chatImageColor];
};

export const getChatId = async (client: PoolClient, chatOwnerId: string, chatTitle: string): Promise<string> => {
    const getChatIdQuery = "SELECT chat_id FROM Chats WHERE chat_owner_id = $1 and title = $2";
    const queryResult = await client.query(getChatIdQuery, [chatOwnerId, chatTitle]);
    return queryResult.rows[0].chat_id;
};
