import { getConversationOnDate } from "./getConversation";
import { Pool } from "pg";

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
