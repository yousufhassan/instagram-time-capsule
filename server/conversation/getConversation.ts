import { Request, Response } from "express";
import { Pool, PoolClient } from "pg";

import { getConversationDateFromRequest, logConversationDoesNotExist, logConversationFound } from "./services";
import { getChatIdFromRequest } from "../chat/src/services";
import { Conversation, Message } from "../cdk-common/layers/logic/nodejs/types";

export const getConversationOnDate = async (pool: Pool, request: Request, response: Response) => {
    const conversationDate = getConversationDateFromRequest(request);
    const chatId = getChatIdFromRequest(request);
    const getConversationQuery = `SELECT messages
                                  FROM conversations
                                  WHERE conversation_date = $1 AND chat_id = $2`;
    const queryResult = await pool.query(getConversationQuery, [conversationDate, chatId]);
    const conversation: Conversation = queryResult.rows[0];
    if (queryResult.rowCount === 0) {
        logConversationDoesNotExist();
        response.json({});
    } else {
        logConversationFound();
        response.json(JSON.parse(conversation.messages));
    }
};

export const insertConversationIntoDB = async (
    client: PoolClient,
    chatId: string,
    date: string,
    conversation: Message[]
): Promise<void> => {
    const insertConversationQuery = `INSERT INTO Conversations(chat_id, conversation_date, messages, num_messages)
                                     VALUES ($1,$2,$3,$4)`;
    await client.query(insertConversationQuery, [chatId, date, JSON.stringify(conversation), conversation.length]);
};
