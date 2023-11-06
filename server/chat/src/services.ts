import { Request } from "express";
import { ChatData } from "../../cdk-common/layers/logic/nodejs/types";
import { log } from "console";
import fs from "fs";

export const getUsernameFromRequest = (request: any): string => {
    return request.username;
};

export const getFilesFromRequest = (request: Request) => {
    return request.files;
};

export const getChatOwnerFromRequest = (request: Request): string => {
    return request.body.user;
};

export const getChatIdFromRequest = (request: any) => {
    return request.chatId;
};

export const getChatDataFromFile = (file: Express.Multer.File): ChatData => {
    return JSON.parse(fs.readFileSync(file.path, "utf-8"));
};

export const getChatTitleFromChatData = (chatData: ChatData) => {
    return chatData.title;
};

export const logChatDoesNotExist = () => {
    log("--- Chat does not exist in database ---");
};

export const logChatDeleted = (chatId?: string) => {
    chatId ? log(`--- Chat with id "${chatId}" deleted from database ---`) : log("--- Chat deleted from database ---");
};
export const logChatInserted = () => {
    log("--- Chat inserted into database ---");
};

export const getChatImageColor = (): string => {
    const colors = ["#512C2C", "#586E52", "#3C4E64"];
    return colors[Math.floor(Math.random() * colors.length)];
};
