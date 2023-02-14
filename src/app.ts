import { database } from "./models/database";
import * as message from "./services/messages";
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
let db = new database();



// Start web app
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('./views/index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});


// Function Playground
let chatData = require('../original_data/message_1.json');
let messages = message.getAllMessages(chatData);

let conversationsMap = message.splitConversationsByDay(messages);
let temp = message.getConversationByDate(conversationsMap, "Jan 16 2023")
console.log(temp);

// for (let i = 0; i < messages.length - 1; i++) {
//     assert(messages[i]['timestamp_ms'] > messages[i+1]['timestamp_ms']);
// }

// messages.forEach(message => {
//     customPrint(message);
// });


// Database Playground
db.connectToDB();
// db.addUser("yousuf", "password123");
// db.getMaxUserID();
// console.log(db.getMaxUserID());


// CREATE USER
app.post("/createUser", async (req, res) => {
    db.createUser(req, res);
})



