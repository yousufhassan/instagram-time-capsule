import { Request, Response, Router } from "express";
import { getConversationOnDate } from "./getConversation";
import { pool } from "../app";

export const conversationsRouter = Router();

conversationsRouter.post("/getConversationOnDate", async (request: Request, response: Response) => {
    getConversationOnDate(pool, request, response);
});
