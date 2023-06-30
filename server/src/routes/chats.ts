import { Request, Response, Router } from "express";
import { pool } from "../app.js";
import { uploadFiles } from "../database/chats/uploadFiles.js";
import { getChatList } from "../database/chats/chats.js";
import multer from "multer";
export const chatsRouter = Router();

const storage = multer.diskStorage({
    destination: "../uploads",
    // @ts-ignore
    filename: function (req: any, file: any, cb: any) {
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
