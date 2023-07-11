import { Request, Response, Router } from "express";
import { pool } from "../app.js";
import { createUser } from "../database/auth/createUser.js";
import { login } from "../database/auth/login.js";
export const authRouter = Router();

authRouter.post("/createUser", async (request: Request, response: Response) => {
    createUser(pool, request, response);
});

authRouter.post("/login", async (request: Request, response: Response) => {
    login(pool, request, response);
});
