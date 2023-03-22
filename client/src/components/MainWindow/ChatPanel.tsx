import '../../styles/general.css';
import './ChatPanel.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Buffer } from "buffer";

function ChatTitle({ chatTitle, bgColor }: { chatTitle: string, bgColor: string }) {
    return (
        <div>
            <div className="chat-title-container flex-row center">
                <span className='flex-row center chat-title-img' style={{ backgroundColor: bgColor }}>
                </span>
                <h3>{chatTitle}</h3>
            </div>
        </div>
    )
}

/**
 * The format of message is
 *      {
 *          'sender_name': string,
 *          'timestamp_ms': number,
 *          'content': string
 *      }
 * 
 * but it may also include additional fields depending on type of message.
 * That is why it's type is 'any'.
 * 
 * */
function MessageBubble({ activeChatTitle, message }: { activeChatTitle: string, message: any }) {
    if (message) {
        // If the other (non-logged in) user sent the message
        if (activeChatTitle === message.sender_name) {
            if (message.content == "Cannot load this type of message") {
                return (
                    <div>
                        <div className="message-bubble-container friend-message error-message">
                            {message.content}
                        </div>
                    </div>
                )
            }

            else {

                return (
                    <div>
                        <div className="message-bubble-container friend-message main-sage-bg white-text">
                            {message.content}
                        </div>
                    </div>
                )
            }
        }

        // If the logged in user sent the message
        else {
            if (message.content == "Cannot load this type of message") {
                return (
                    <div>
                        <div className="message-bubble-container user-message error-message">
                            {message.content}
                        </div>
                    </div>
                )
            }

            else {

                return (
                    <div>
                        <div className="message-bubble-container user-message dark-grey-bg white-text">
                            {message.content}
                        </div>
                    </div>
                )
            }
        }
    }

    else {
        console.log("something weird");
        return (
            <div>
            </div>
        )
    }
}


function ChatPanel({ activeChat }: { activeChat: any }) {
    const [messageList, setMessageList] = useState(Array<JSX.Element>());

    const displayChat = async () => {
        let date = '2022-09-17'  // TODO: get date from user input
        axios.post('http://localhost:8000/getConversationOnDate', { "date": date, "chatId": activeChat.chat_id })
            .then(response => {
                // console.log(response.data);
                let rawMessageList = response.data;
                // console.log(rawMessageList);

                let newMessageList = new Array<JSX.Element>();

                for (let i = rawMessageList.length - 1; i >= 0; i--) {
                    // console.log(rawMessageList[i]);

                    let message = rawMessageList[i]

                    // If the message contains no text-content (i.e. link, photo, post, etc.), then
                    // set text-content to be an error message.
                    if (!("content" in rawMessageList[i])) {
                        message["content"] = "Cannot load this type of message"
                        // console.log(message);
                    }
                    else {
                        let arr: number[] = []
                        for (let i = 0; i < message["content"].length; i++) {
                            arr.push(message["content"].charCodeAt(i));
                        }
                        message["content"] = Buffer.from(arr).toString("utf8");
                        console.log(message["content"]);
                        
                    }

                    // Add message to list of messages
                    newMessageList.push(
                        <li key={i}>
                            <MessageBubble activeChatTitle={activeChat.title} message={message} />
                        </li>
                    )
                }

                setMessageList(newMessageList)
            })
            .catch(function (error) {
                console.log("Error: " + error);
            })
    }

    useEffect(() => {
        displayChat();
    }, [activeChat])

    if (Object.keys(activeChat).length === 0) {
        // TODO: Display something in the chat panel to signify this
        return (
            <div>
                <div id="chat-panel-header" className='flex-row space-btwn'>
                </div>
                <div id="chat-area" className='no-active-chat'>
                    {/* TODO: Center this in the chat area */}
                    <h3>
                        Select a chat to view from the list or add a new one.
                    </h3>
                </div>
            </div>
        )
    }

    // else {
    //     // Display the chat
    //     displayChat();
    // }

    return (
        <div>
            <div id="chat-panel-header" className='flex-row space-btwn'>
                <ChatTitle chatTitle={activeChat.title} bgColor={activeChat.bg_color} />
                <div className="icons-container flex-row center">
                    <span className="material-symbols-outlined icon btn"> casino </span>
                    <span className="material-symbols-outlined icon btn"> info </span>
                    <span className="material-symbols-outlined icon btn" style={{ color: "red" }}> delete </span>
                </div>
            </div>
            <div id="chat-area">
                <ul>
                    {messageList}
                </ul>
            </div>
        </div>
    )
}

export default ChatPanel;