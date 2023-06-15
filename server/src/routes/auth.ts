import { db } from "../app.js";
import express from "express";
export const router = express.Router();

router.post("/createUser", async (req: any, res: any) => {
    db.createUser(req, res);
    console.log(res);
});

router.post("/login", async (req: any, res: any) => {
    db.login(req, res);
});

// app.post("/createUser", async (req, res) => {
//     db.createUser(req, res);
//     console.log(res);
// });

// // LOGIN USER
// app.post("/login", async (req, res) => {
//     db.login(req, res);
// });
