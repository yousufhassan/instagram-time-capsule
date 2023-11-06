import { Router } from "express";
// import { uploadFiles } from "./uploadFiles";
// import multer from "multer";
import { Handler } from "aws-cdk-lib/aws-lambda";
import { Pool } from "pg";
import { getChatList } from "./chatList";
import { deleteChat } from "./deleteChat";
export const chatsRouter = Router();

let pool: Pool;

// @ts-ignore  remove later!!! (just like other similar TODOs)
export const getChatListHandler: Handler = async (event, context) => {
    if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    }
    const eventBody = JSON.parse(event.body);
    const response = await getChatList(pool, eventBody);
    return response;
};

// @ts-ignore  remove later!!! (just like other similar TODOs)
export const deleteChatHandler: Handler = async (event, context) => {
    if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    }
    const eventBody = JSON.parse(event.body);
    const response = await deleteChat(pool, eventBody);
    return response;
};

// const storage = multer.diskStorage({
//     destination: "./uploads",
//     // @ts-ignore The unused 'request' variable. The function expects it to be there
//     // otherwise, things don't work nicely.
//     filename: function (request: Request, file: any, cb: any) {
//         cb(null, file.originalname.slice(0, -5) + "-" + Date.now() + ".json");
//     },
// });

// const upload = multer({
//     storage: storage,
// });

// chatsRouter.post("/uploadFiles", upload.array("files"), async (request: Request, response: Response) => {
//     uploadFiles(pool, request, response);
// });

// chatsRouter.post("/getChatList", async (request: Request, response: Response) => {
//     getChatList(pool, request, response);
// });
