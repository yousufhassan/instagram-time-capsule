import { Pool, PoolClient } from "pg";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../../cdk-common/layers/logic/nodejs/database";
import { log } from "console";
import { getChatIdFromRequest, logChatDeleted } from "./services";

export const deleteChat = async (pool: Pool, request: Request): Promise<Object> => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const chatId = getChatIdFromRequest(request);
        await deleteChatFromId(client, chatId);
        await commitTransaction(client);
        return { statusCode: 200 };
    } catch (error: any) {
        await rollbackTransaction(client);
        log(error);
        return error;
    } finally {
        releasePoolClient(client);
    }
};

export const deleteChatFromId = async (client: PoolClient, chatId: string): Promise<void> => {
    const deleteChatQuery = "DELETE FROM Chats WHERE chat_id = $1";
    await client.query(deleteChatQuery, [chatId]);
    logChatDeleted(chatId);
};
