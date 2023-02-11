"use strict";
exports.__esModule = true;
var assert = require('console').assert;
var express = require('express');
var app = express();
var port = 3000;
// Start web app
//Idiomatic expression in express to route and respond to a client request
// app.get('/', (req, res) => {        //get requests to the root ("/") will route here
//     res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
//                                                         //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
// });
// app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
//     console.log(`Now listening on port ${port}`); 
// });
function customPrint(message) {
    var senderName = message['sender_name'];
    var datetime = new Date(message['timestamp_ms']);
    var date = datetime.toLocaleString('default', { month: 'short',
        day: '2-digit', year: 'numeric' });
    var time = datetime.toLocaleString('default', { hour: 'numeric', minute: '2-digit' });
    var content = message['content'];
    console.log("[".concat(date, " - ").concat(time, "] [").concat(senderName, "]: ").concat(content));
}
/**
 * Function to retrieve all messages from a given file path.
 *
 * @param filepath - A string representing the file path to retrieve messages from.
 * @returns An array of JSON, where each JSON represents a message.
 */
function getAllMessages(filepath) {
    var data = require(filepath);
    var messages = data.messages;
    return messages;
}
/**
 * Function that splits a given array of messages into conversations by day.
 *
 * @param messages Array of messages to be split into conversations by their date.
 * @returns Map[dateAsString, ArrayOfMessages]
 */
function splitConversationsByDay(messages) {
    var conversationsMap = new Map();
    messages.forEach(function (message) {
        var date = new Date(message['timestamp_ms']).toDateString().slice(4);
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
function getConversationByDate(conversationsMap, date) {
    if (!(conversationsMap.has(date))) {
        console.log('No conversations found for ' + date);
        return [];
    }
    return conversationsMap.get(date);
}
var messages = getAllMessages('./original_data/message_1.json');
// console.log(messages);
var conversationsMap = splitConversationsByDay(messages);
var temp = getConversationByDate(conversationsMap, "Jan 16 2023");
console.log(temp);
for (var i = 0; i < messages.length - 1; i++) {
    assert(messages[i]['timestamp_ms'] > messages[i + 1]['timestamp_ms']);
}
messages.forEach(function (message) {
    customPrint(message);
});
