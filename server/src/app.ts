import cors from "cors";
import express from "express";
// import multer from "multer";
// import * as fs from "fs";
// import { promisify } from "util";
import { database } from "./models/database.js";
// import { getAllMessages, getChatTitle, splitConversationsByDay } from "./services/messages.js";
import { createPool } from "./database/database.js";
import { authRouter } from "./routes/auth.js";
import { chatsRouter } from "./routes/chats.js";
import { conversationsRouter } from "./routes/conversations.js";
export const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

app.use("/auth", authRouter);
app.use("/chats", chatsRouter);
app.use("/conversations", conversationsRouter);
// const unlinkAsync = promisify(fs.unlink);
export const db = new database();
export const pool = createPool();

// Start web app
app.get("/", (res: any) => {
    //get requests to the root ("/") will route here
    res.sendFile("./views/index.html", {
        root: __dirname,
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.listen(port, () => {
    //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});

// app.post("/getConversationOnDate", (req: any, res: any) => {
//     let date = req.body.date;
//     let chatId = req.body.chatId;
//     db.con.getConnection(async function (connection: any) {
//         db.getConversationOnDate(connection, res, date, chatId);
//         connection.release();
//     });
// });
