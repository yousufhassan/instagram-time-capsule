import { database } from "./models/database";
import * as message from "./services/messages";
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';

const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;
const unlinkAsync = promisify(fs.unlink)
let db = new database();



// Start web app
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('./views/index.html', { root: __dirname });      //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.get("/message", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});


// Function Playground
// let chatData = require('../original_data/message_1.json');
// let messages = message.getAllMessages(chatData);

// let conversationsMap = message.splitConversationsByDay(messages);
// let temp = message.getConversationByDate(conversationsMap, "2023-01-16")
// console.log(conversationsMap);



// for (let i = 0; i < messages.length - 1; i++) {
//     assert(messages[i]['timestamp_ms'] > messages[i+1]['timestamp_ms']);
// }

// messages.forEach(message1 => {
//     message.customPrint(message1);
// });

let chatData = require('../original-data/original-files/message_4.json');
let messages = message.getAllMessages(chatData);
messages.forEach(message1 => {
    message.customPrint(message1);
});

// for (let i = 1200; i >= 900; i--) {
//     message.customPrint(messages[i]);
// }


app.post("/getConversationOnDate", (req, res) => {
    let date = req.body.date;
    let chatId = req.body.chatId;
    db.con.getConnection(async function (err, connection) {
        db.getConversationOnDate(connection, req, res, date, chatId)
        connection.release();
    })
})

app.post("/getAllChats", (req, res) => {
    let username = req.body.username  // Username of the logged in user
    db.con.getConnection(async function (err, connection) {
        db.getUserIdFromUsername(connection, req, res, username)
            .then(function (userId) {
                return userId;
            })
            .then(async function (userId) {
                // console.log("woohoo");
                // res.send("woohoo");

                db.getAllUserChats(connection, req, res, userId);
            })
        connection.release();
    })
})


const storage = multer.diskStorage(
    {
        destination: '../uploads',
        filename: function (req, file, cb) {
            cb(null, file.originalname.slice(0, -5) + '-' + Date.now() + ".json");
        }
    }
);

const upload = multer({ storage: storage });

app.post("/uploadFiles", upload.array('files'), (req, res) => {
    let files = req.files;
    let chatOwner = req.body.user


    // Obtain the chat title to store in the database (only need to do once for each upload)
    let chatData = require(files[0].path)
    let chatTitle = message.getChatTitle(chatData)


    db.con.getConnection(async function (err, connection) {
        if (err) throw (err)

        // Get the userId of the logged in user
        db.getUserIdFromUsername(connection, req, res, chatOwner)
            .then(function (chatOwnerId) {
                return chatOwnerId;
            }).then(async function (chatOwnerId) {
                // If this chat already exists in the database, delete it
                // Note: deleteChat will also delete all conversations for that chat.
                await db.deleteChat(connection, req, res, chatOwnerId, chatTitle)
                return chatOwnerId
            }).then(async function (chatOwnerId) {
                // Add this chat to the database
                return db.addChat(connection, req, res, chatOwnerId, chatTitle);
            }).then(async function (chatIdAndColor) {
                let chatId = chatIdAndColor[0];
                let bgColor = chatIdAndColor[1];
                // Get all conversations from this file upload and store in the database
                console.log("Chat ID: " + chatId);
                let numMessages = 0;  // Tracks how many messages were sent in this chat

                files.forEach(async file => {
                    let chatData = require(file.path)
                    let messages = message.getAllMessages(chatData);
                    let conversationsMap = message.splitConversationsByDay(messages);

                    conversationsMap.forEach(async (conversation, date) => {
                        numMessages += conversation.length;
                        let conversationId = await db.addConversation(connection, req, res, chatId,
                            date, JSON.stringify(conversation), conversation.length)
                        console.log("Conversation ID: " + conversationId);
                    })

                    // Delete file from server
                    await unlinkAsync(file.path);

                    // res.send()
                })
                // console.log("first: " + numMessages);
                res.json({ chatId: chatId, chatTitle: chatTitle, numMessages: numMessages, bgColor: bgColor });
            })
        connection.release();

    })
})



// ---------------------------------------------------------------------------
// CREATE USER
app.post("/createUser", async (req, res) => {
    db.createUser(req, res);
    console.log(res);
})

// LOGIN USER
app.post("/login", async (req, res) => {
    db.login(req, res);
})

