import cors from "cors";
import express from "express";
import multer from "multer";
import * as fs from "fs";
import { promisify } from "util";
import { database } from "./models/database.js";
import { getAllMessages, getChatTitle, splitConversationsByDay } from "./services/messages.js";
import { createPool } from "./database/database.js";
import { authRouter } from "./routes/auth.js";
import { chatsRouter } from "./routes/chats.js";
export const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

app.use("/auth", authRouter);
app.use("/chats", chatsRouter);
const unlinkAsync = promisify(fs.unlink);
export const db = new database();
export const pool = createPool();

// Start web app
//Idiomatic expression in express to route and respond to a client request
app.get("/", (res: any) => {
    //get requests to the root ("/") will route here
    res.sendFile("./views/index.html", {
        root: __dirname,
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

// app.get("/message", (req: any, res: any) => {
//     res.json({
//         message: "Hello from server!",
//     });
// });

app.listen(port, () => {
    //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});

// Function Playground
// let chatData = require('../original_data/message_1.json');
// let messages = message.getAllMessages(chatData);
//
// let conversationsMap = message.splitConversationsByDay(messages);
// let temp = message.getConversationByDate(conversationsMap, "2023-01-16")
// console.log(conversationsMap);
//
//
//
// for (let i = 0; i < messages.length - 1; i++) {
//     assert(messages[i]['timestamp_ms'] > messages[i+1]['timestamp_ms']);
// }

// messages.forEach(message1 => {
//     message.customPrint(message1);
// });
//
// let chatData = require('../original-data/original-files/message_4.json');
// let messages = message.getAllMessages(chatData);
// messages.forEach(message1 => {
//     message.customPrint(message1);
// });
//
// for (let i = 1200; i >= 900; i--) {
//     message.customPrint(messages[i]);
// }

app.post("/getConversationOnDate", (req: any, res: any) => {
    let date = req.body.date;
    let chatId = req.body.chatId;
    db.con.getConnection(async function (connection: any) {
        db.getConversationOnDate(connection, res, date, chatId);
        connection.release();
    });
});

// app.post("/getAllChats", (req: any, res: any) => {
//     let username = req.body.username; // Username of the logged in user
//     db.con.getConnection(async function (connection: any) {
//         db.getUserIdFromUsername(connection, username)
//             .then(function (userId) {
//                 return userId;
//             })
//             .then(async function (userId) {
//                 // console.log("woohoo");
//                 // res.send("woohoo");

//                 db.getAllUserChats(connection, res, userId);
//             });
//         connection.release();
//     });
// });

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

app.post("/uploadFiles", upload.array("files"), (req: any, res: any) => {
    let files = req.files;
    let chatOwner = req.body.user;

    // Obtain the chat title to store in the database (only need to do once for each upload)
    let chatData = require(files[0].path);
    let chatTitle = getChatTitle(chatData);

    db.con.getConnection(async function (err: any, connection: any) {
        if (err) throw err;

        // Get the userId of the logged in user
        db.getUserIdFromUsername(connection, chatOwner)
            .then(function (chatOwnerId) {
                return chatOwnerId;
            })
            .then(async function (chatOwnerId) {
                // If this chat already exists in the database, delete it
                // Note: deleteChat will also delete all conversations for that chat.
                await db.deleteChat(connection, chatOwnerId, chatTitle);
                return chatOwnerId;
            })
            .then(async function (chatOwnerId) {
                // Add this chat to the database
                return db.addChat(connection, chatOwnerId, chatTitle);
            })
            .then(async function (chatIdAndColor) {
                let chatId = chatIdAndColor[0];
                let bgColor = chatIdAndColor[1];
                // Get all conversations from this file upload and store in the database
                console.log("Chat ID: " + chatId);
                let numMessages = 0; // Tracks how many messages were sent in this chat

                files.forEach(async (file: any) => {
                    // let chatData = require(file.path);
                    let messages = getAllMessages(chatData);
                    let conversationsMap = splitConversationsByDay(messages);

                    conversationsMap.forEach(async (conversation, date) => {
                        numMessages += conversation.length;
                        let conversationId = await db.addConversation(
                            connection,
                            chatId,
                            date,
                            JSON.stringify(conversation),
                            conversation.length
                        );
                        console.log("Conversation ID: " + conversationId);
                    });

                    // Delete file from server
                    await unlinkAsync(file.path);

                    // res.send()
                });
                // console.log("first: " + numMessages);
                res.json({
                    chatId: chatId,
                    chatTitle: chatTitle,
                    numMessages: numMessages,
                    bgColor: bgColor,
                });
            });
        connection.release();
    });
});

// ---------------------------------------------------------------------------
// CREATE USER
// app.post("/createUser", async (req, res) => {
//     db.createUser(req, res);
//     console.log(res);
// });

// // LOGIN USER
// app.post("/login", async (req, res) => {
//     db.login(req, res);
// });
