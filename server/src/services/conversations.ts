import { log } from "console";
import { Request } from "express";

export const getConversationDateFromRequest = (request: Request) => {
    return request.body.date;
};

export const logConversationInserted = (numConversations: number) => {
    log(`--- ${numConversations} conversations inserted into database ---`);
};

export const logConversationDoesNotExist = () => {
    log("--- Conversation does not exist in DB ---");
};

export const logConversationFound = () => {
    log("--- Conversation found in DB ---");
};
