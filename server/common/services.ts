import { PoolClient } from "pg";

export const getFormattedDate = (date: Date) => {
    return (
        date.getFullYear() +
        "-" +
        date.toLocaleDateString("default", { month: "2-digit" }) +
        "-" +
        date.toLocaleDateString("default", { day: "2-digit" })
    );
};

import { ChatData, Message } from "../types.js";

/**
 * Prints the message in a readable format.
 *
 * @param message message JSON object to print
 */
export function customPrint(message: Message): void {
    const senderName = message.sender_name;
    const datetime = new Date(message.timestamp_ms);
    const date = datetime.toLocaleString("default", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
    const time = datetime.toLocaleString("default", { hour: "numeric", minute: "2-digit" });

    const content = message.content;

    console.log(`[${date} - ${time}] [${senderName}]: ${content}`);
}

/**
 * Function to retrieve all messages from a given file path.
 *
 * @param filepath - A string representing the file path to retrieve messages from.
 * @returns An array of JSON, where each JSON represents a message.
 */
export function getAllMessages(chatData: ChatData): Message[] {
    const messages = chatData.messages;
    return messages;
}

export const getUserIdFromUsername = async (client: PoolClient, username: string): Promise<string> => {
    const getUserIdQuery = "SELECT user_id FROM Users WHERE username = $1";
    const queryResult = await client.query(getUserIdQuery, [username]);
    return queryResult.rows[0].user_id;
};
