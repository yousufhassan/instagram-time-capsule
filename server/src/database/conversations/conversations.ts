import { PoolClient } from "pg";

export const insertConversationIntoDB = async (
    client: PoolClient,
    chatId: string,
    date: string,
    conversation: JSON[]
): Promise<void> => {
    const insertConversationQuery = `INSERT INTO Conversations(chat_id, conversation_date, messages, num_messages)
                                     VALUES ($1,$2,$3,$4)`;
    await client.query(insertConversationQuery, [chatId, date, conversation, conversation.length]);
};
