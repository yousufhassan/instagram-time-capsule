import { Handler } from "aws-lambda";
import { createUser } from "./createUser";
import pg from "pg";
// import { login } from "./login.js";

// @ts-ignore  remove later!!!
// TODO: create interfaces/types for event (and maybe context). Make a different one for each event type
export const handler: Handler = async (event, context) => {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const eventBody = JSON.parse(event.body);
    const response = await createUser(pool, eventBody);
    return response;
};

// authRouter.post("/login", async (request: Request, response: Response) => {
//     login(pool, request, response);
// });
