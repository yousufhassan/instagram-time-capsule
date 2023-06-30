import { Request } from "express";
import fs from "fs";
import { ChatData } from "../types.js";
import { log } from "console";

export const getFilesFromRequest = (request: Request) => {
    return request.files;
};

export const getChatOwnerFromRequest = (request: Request): string => {
    return request.body.user;
};

export const getChatIdFromRequest = (request: Request) => {
    return request.body.chatId;
};

export const getChatDataFromFiles = (files: Express.Multer.File[]): ChatData => {
    return JSON.parse(fs.readFileSync(files[0].path, "utf-8"));
};

export const getChatTitleFromChatData = (chatData: ChatData) => {
    return chatData.title;
};

export const logChatDoesNotExist = () => {
    log("--- Chat does not exist in database ---");
};

export const logChatDeleted = () => {
    log("--- Chat deleted from database ---");
};
export const logChatInserted = () => {
    log("--- Chat inserted into database ---");
};

export const getChatImageColor = (): string => {
    const colors = ["#512C2C", "#586E52", "#3C4E64"];
    return colors[Math.floor(Math.random() * colors.length)];
};
