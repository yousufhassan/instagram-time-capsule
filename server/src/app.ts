import { database } from "./models/database";
import * as message from "./services/messages";
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;
let db = new database();

const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)



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


// Database Playground
// db.connectToDB();


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
            }).then(async function (chatId) {
                // Get all conversations from this file upload and store in the database
                console.log("Chat ID: " + chatId);
                let numMessages = 0;  // Tracks how many messages were sent in this chat

                files.forEach(async file => {
                    let chatData = require(file.path)
                    let messages = message.getAllMessages(chatData);
                    numMessages += messages.length;
                    let conversationsMap = message.splitConversationsByDay(messages);

                    conversationsMap.forEach(async (conversation, date) => {
                        let conversationId = await db.addConversation(connection, req, res, chatId, date, JSON.stringify(conversation))
                        console.log("Conversation ID: " + conversationId);
                    })

                    // Delete file from server
                    await unlinkAsync(file.path);

                    // res.send()
                })
                // console.log("first: " + numMessages);
                res.json({ chatTitle: chatTitle, numMessages: numMessages });
            })
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

