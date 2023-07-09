import { ChatData, Message } from "../types.js";

/**
 * Prints the message in a readable format.
 *
 * @param message message JSON object to print
 */
export function customPrint(message: any): void {
    let senderName = message["sender_name"];
    let datetime = new Date(message["timestamp_ms"]);
    let date = datetime.toLocaleString("default", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
    let time = datetime.toLocaleString("default", { hour: "numeric", minute: "2-digit" });

    let content = message["content"];

    console.log(`[${date} - ${time}] [${senderName}]: ${content}`);
}

/**
 * Returns the title of the given chat.
 *
 * @param chatData JSON file containing all chat data
 * @returns A string containing the chat title
 */
export function getChatTitle(chatData: ChatData): string {
    return chatData["title"];
}

/**
 * Function to retrieve all messages from a given file path.
 *
 * @param filepath - A string representing the file path to retrieve messages from.
 * @returns An array of JSON, where each JSON represents a message.
 */
export function getAllMessages(chatData: ChatData): Message[] {
    let messages = chatData["messages"];
    return messages;
}

/**
 * Function to retrieve a conversation by date from a given map of conversations.
 *
 * @param conversationsMap An ESMap object representing a map of conversations, where each key is
 *                           a date string and each value is the Array of messages sent
 *                           on that date.
 * @param date A string representing the date for which the conversation is to be retrieved.
 * @returns An array of ESMap objects, where each ESMap object represents a message in the
 *          retrieved conversation.
 *          If no conversation is found for the given date, an empty array is returned.
 */
export function getConversationByDate(conversationsMap: Map<string, JSON[]>, date: string): JSON[] {
    if (!conversationsMap.has(date)) {
        console.log("No conversations found for " + date);
        return [];
    }
    return conversationsMap.get(date)!;
}
