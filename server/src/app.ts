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
// console.log(temp);

// for (let i = 0; i < messages.length - 1; i++) {
//     assert(messages[i]['timestamp_ms'] > messages[i+1]['timestamp_ms']);
// }

// messages.forEach(message => {
//     customPrint(message);
// });


// Database Playground
db.connectToDB();

// Add chat
let chatOwner = "yousuf"  // Will actually get this from local storage
let chatTitle = message.getChatTitle(chatData)
// console.log(chatOwner);
// console.log(chatTitle);
// db.addChat(chatOwner, chatTitle)

app.post("/addChat", async (req, res) => {

    // db.uploadData(req, res, chatOwner, chatTitle);
    db.addChat(req, res, chatOwner, chatTitle)
    console.log(Object.values(res));
    
})


// Add conversation
// console.log(conversationsMap.keys());
// conversationsMap.forEach((conversation, date) => {
//     console.log(date);
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



