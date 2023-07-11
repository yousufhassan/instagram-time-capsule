import { Request, Response, Router } from "express";
import { getConversationOnDate } from "../database/conversations/conversations.js";
import { pool } from "../app.js";

export const conversationsRouter = Router();

conversationsRouter.post("/getConversationOnDate", async (request: Request, response: Response) => {
    getConversationOnDate(pool, request, response);
});
