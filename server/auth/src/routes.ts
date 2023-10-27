import { Handler } from "aws-lambda";
import { createUser } from "./createUser";
import { Pool } from "pg";

let pool: Pool;

// @ts-ignore  remove later!!!
// TODO: create interfaces/types for event (and maybe context). Make a different one for each event type
export const handler: Handler = async (event, context) => {
    if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    }
    const eventBody = JSON.parse(event.body);
    const response = await createUser(pool, eventBody);
    return response;
};

// authRouter.post("/login", async (request: Request, response: Response) => {
//     login(pool, request, response);
// });
