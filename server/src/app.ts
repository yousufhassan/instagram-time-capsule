import { database } from "./models/database";
import * as message from "./services/messages";
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;
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
let chatData = require('../original_data/message_1.json');
let messages = message.getAllMessages(chatData);

let conversationsMap = message.splitConversationsByDay(messages);
let temp = message.getConversationByDate(conversationsMap, "2023-01-16")
// console.log(conversationsMap);



// for (let i = 0; i < messages.length - 1; i++) {
//     assert(messages[i]['timestamp_ms'] > messages[i+1]['timestamp_ms']);
// }

// messages.forEach(message1 => {
//     message.customPrint(message1);
// });


// Database Playground
// db.connectToDB();

// Add chat
let chatOwner = "yousuf"  // Will actually get this from local storage
let chatTitle = message.getChatTitle(chatData)
// console.log(chatOwner);
// console.log(chatTitle);
// db.addChat(chatOwner, chatTitle)

app.post("/addChat", async (req, res) => {
    db.con.getConnection(async function (err, connection) {
        if (err) throw (err)
        db.getUserIdFromUsername(connection, req, res, chatOwner).then(function (chatOwnerId) {
            console.log("first: " + chatOwnerId);
            return chatOwnerId;
        }).then(async function (chatOwnerId) {
            console.log("second: " + chatOwnerId);
            // Note: deleteChat will also delete all conversations for that chat.
            await db.deleteChat(connection, req, res, chatOwnerId, chatTitle)
            return chatOwnerId
        }).then(async function (chatOwnerId) {
            console.log("third: " + chatOwnerId);
            return db.addChat(connection, req, res, chatOwnerId, chatTitle);
        }).then(async function (chatId) {
            console.log("Chat ID: " + chatId);
            conversationsMap.forEach((conversation, date) => {
                let conversationId = db.addConversation(connection, req, res, chatId, date, JSON.stringify(conversation))
                console.log("Conversation ID: " + conversationId);
            })
        })
    })

})


// Add conversation
// console.log(conversationsMap.keys());
// conversationsMap.forEach((conversation, date) => {
//     console.log(date);
//     console.log(conversation);
//     // db.addConversation(date, conversation)
// })



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



