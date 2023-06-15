// import { ESMap } from "typescript";

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
export function getChatTitle(chatData: any): string {
    return chatData["title"];
}

/**
 * Function to retrieve all messages from a given file path.
 *
 * @param filepath - A string representing the file path to retrieve messages from.
 * @returns An array of JSON, where each JSON represents a message.
 */
export function getAllMessages(chatData: any): JSON[] {
    let messages = chatData["messages"];
    return messages;
}

/**
 * Function that splits a given array of messages into conversations by day.
 *
 * @param messages Array of messages to be split into conversations by their date.
 * @returns Map[dateAsString, ArrayOfMessages]
 */
export function splitConversationsByDay(messages: any[]): Map<string, JSON[]> {
    let conversationsMap = new Map();
    messages.forEach((message) => {
        let date = new Date(message["timestamp_ms"]);
        let formattedDate =
            date.getFullYear() +
            "-" +
            date.toLocaleDateString("default", { month: "2-digit" }) +
            "-" +
            date.toLocaleDateString("default", { day: "2-digit" });
        if (conversationsMap.has(formattedDate)) {
            conversationsMap.get(formattedDate).push(message);
        } else {
            conversationsMap.set(formattedDate, [message]);
        }
    });
    return conversationsMap;
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
