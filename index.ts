import { sendFile } from "express/lib/response";
import { PassThrough } from "stream";
import { ESMap, Map } from "typescript";
import { database } from "./database";
// let a = require('mysql');

const { assert } = require('console');
const express = require('express');
const app = express();
const port = 3000;
let db = new database();

// Start web app
//Idiomatic expression in express to route and respond to a client request
// app.get('/', (req, res) => {        //get requests to the root ("/") will route here
//     res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
//                                                         //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
// });

// app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
//     console.log(`Now listening on port ${port}`); 
// });


function customPrint(message: JSON): void {
    let senderName = message['sender_name'];
    let datetime = new Date(message['timestamp_ms']);
    let date = datetime.toLocaleString('default', {month: 'short',
                                                   day: '2-digit', year: 'numeric'});
    let time = datetime.toLocaleString('default', {hour: 'numeric', minute: '2-digit'});

    let content = message['content'];

    console.log(`[${date} - ${time}] [${senderName}]: ${content}`);
}


function getChatTitle(chatData: JSON): string {
    return chatData['title'];
}


/**
 * Function to retrieve all messages from a given file path.
 * 
 * @param filepath - A string representing the file path to retrieve messages from.
 * @returns An array of JSON, where each JSON represents a message.
 */
function getAllMessages(chatData: JSON): JSON[] {
    let messages = chatData['messages'];
    return messages;
}

/**
 * Function that splits a given array of messages into conversations by day.
 * 
 * @param messages Array of messages to be split into conversations by their date.
 * @returns Map[dateAsString, ArrayOfMessages]
 */
function splitConversationsByDay(messages: JSON[]): ESMap<string, JSON[]> {
    let conversationsMap = new Map();
    messages.forEach(message => {
        let date = new Date(message['timestamp_ms']).toDateString().slice(4);
        if (conversationsMap.has(date)) {
            conversationsMap.get(date).push(message);
        }
        else {
            conversationsMap.set(date, [message]);
        }
    });
    return conversationsMap;
}

/**
 * Function to retrieve a conversation by date from a given map of conversations.
 * 
 * @param conversationsMap An ESMap object representing a map of conversations, where each key is
 *                           a date string and each value is the Array of messages sent
 *                           on that date.
 * @param date A string representing the date for which the conversation is to be retrieved.
 * @returns An array of ESMap objects, where each ESMap object represents a message in the
 *          retrieved conversation. 
 *          If no conversation is found for the given date, an empty array is returned.
 */
function getConversationByDate(conversationsMap: ESMap<string, JSON[]>,
                               date: string): JSON[] {
    if (!(conversationsMap.has(date))) {
        console.log('No conversations found for ' + date);
        return [];
    }
    return conversationsMap.get(date)!;
}


// Function Playground
let chatData = require('./original_data/message_1.json');
let messages = getAllMessages(chatData);

let conversationsMap = splitConversationsByDay(messages);
let temp = getConversationByDate(conversationsMap, "Jan 16 2023")
// console.log(temp);

// for (let i = 0; i < messages.length - 1; i++) {
//     assert(messages[i]['timestamp_ms'] > messages[i+1]['timestamp_ms']);
// }

// messages.forEach(message => {
//     customPrint(message);
// });


// Database Playground
db.connectToDB();
db.addUser("yousuf", "password123");
// db.getMaxUserID();
// console.log(db.getMaxUserID());




