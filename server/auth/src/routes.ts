// import { Request, Response, Router } from "express";
import { Router } from "express";
import { Handler } from "aws-lambda";
// import { pool } from "../../app.js";
// import { createUser } from "./createUser.js";
// import { login } from "./login.js";
export const authRouter = Router();

export const handler: Handler = async (event, context) => {
    // console.log(event);
    // console.log(context);
    return { event: event, context: context };
};

// authRouter.post("/createUser", async (request: Request, response: Response) => {
//     createUser(pool, request, response);
// });

// authRouter.post("/login", async (request: Request, response: Response) => {
//     login(pool, request, response);
// });
