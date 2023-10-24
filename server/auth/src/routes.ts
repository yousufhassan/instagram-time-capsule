// import { Request, Response, Router } from "express";
import { Handler } from "aws-lambda";
// import { pool } from "opt/business-logic/app.js";
import { createUser } from "../src/createUser";
import pg from "pg";
// import { login } from "./login.js";
// export const authRouter = Router();
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// @ts-ignore  remove later!!!
// TODO: create interfaces/types for event (and maybe context). Make a different one for each event type
export const handler: Handler = async (event, context) => {
    const response = await createUser(pool, event);
    return response;
};

// authRouter.post("/createUser", async (request: Request, response: Response) => {
// createUser(pool, request, response);
// });

// authRouter.post("/login", async (request: Request, response: Response) => {
//     login(pool, request, response);
// });
