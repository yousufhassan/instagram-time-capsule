import { Request, Response, Router } from "express";
import { getChatList } from "../database/chats/chats.js";
import { pool } from "../app.js";
export const chatsRouter = Router();

chatsRouter.post("/getChatList", async (request: Request, response: Response) => {
    getChatList(pool, request, response);
});
