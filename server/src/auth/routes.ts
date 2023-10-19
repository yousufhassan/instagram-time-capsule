import { Request, Response, Router } from "express";
import { pool } from "../app.js";
import { createUser } from "./createUser.js";
import { login } from "./login.js";
export const authRouter = Router();

authRouter.post("/createUser", async (request: Request, response: Response) => {
    createUser(pool, request, response);
});

authRouter.post("/login", async (request: Request, response: Response) => {
    login(pool, request, response);
});
