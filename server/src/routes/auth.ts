import { Request, Response, Router } from "express";
// import { db } from "../app.js";
import { pool } from "../app.js";
import { createUser } from "../database/auth/createUser.js";
import { login } from "../database/auth/login.js";
export const authRouter = Router();

authRouter.post("/createUser", async (request: Request, response: Response) => {
    createUser(pool, request, response);
});

authRouter.post("/login", async (request: Request, response: Response) => {
    // db.login(req, res);
    login(pool, request, response);
});

// app.post("/createUser", async (req, res) => {
//     db.createUser(req, res);
//     console.log(res);
// });

// // LOGIN USER
// app.post("/login", async (req, res) => {
//     db.login(req, res);
// });
