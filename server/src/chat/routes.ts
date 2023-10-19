import { Request, Response, Router } from "express";
import { pool } from "../app.js";
import { uploadFiles } from "./uploadFiles.js";
import { getChatList } from "./chatList.js";
import multer from "multer";
export const chatsRouter = Router();

const storage = multer.diskStorage({
    destination: "./uploads",
    // @ts-ignore The unused 'request' variable. The function expects it to be there
    // otherwise, things don't work nicely.
    filename: function (request: Request, file: any, cb: any) {
        cb(null, file.originalname.slice(0, -5) + "-" + Date.now() + ".json");
    },
});

const upload = multer({
    storage: storage,
});

chatsRouter.post("/uploadFiles", upload.array("files"), async (request: Request, response: Response) => {
    uploadFiles(pool, request, response);
});

chatsRouter.post("/getChatList", async (request: Request, response: Response) => {
    getChatList(pool, request, response);
});