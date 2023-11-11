// import { Request, Response, Router } from "express";
import { getConversationOnDate } from "./getConversation";
import { Pool } from "pg";
// import { pool } from "../../app";

let pool: Pool;

// @ts-ignore  remove later!!! (just like other similar TODOs)
export const getConversationOnDateHandler: Handler = async (event, context) => {
    if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    }
    const eventBody = JSON.parse(event.body);
    const response = await getConversationOnDate(pool, eventBody);
    return response;
};

// export const conversationsRouter = Router();

// conversationsRouter.post("/getConversationOnDate", async (request: Request, response: Response) => {
//     getConversationOnDate(pool, request, response);
// });
