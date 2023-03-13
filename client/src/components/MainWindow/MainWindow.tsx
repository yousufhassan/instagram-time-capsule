// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import './MainWindow.css';
// import './Home.css';
import UploadFile from '../UploadFile/UploadFile';
import { useEffect, useState } from 'react';
import axios from 'axios';


function ChatItem({ chatTitle, numMessages, bgColor }: { chatTitle: string, numMessages: number, bgColor: string }) {
    return (
        <div>
            <div className="flex-row center chat-item-container">
                <span className='flex-row center chat-item-img' style={{ backgroundColor: bgColor }}>
                </span>
                <div className="chat-item-details">
                    <h3 className='no-margin white-text'>{chatTitle}</h3>
                    <p className='thin white-text'>{numMessages} messages</p>
                </div>
            </div>
        </div>
    )
}

function MainWindow() {
    const [chatList, setChatList] = useState(Array<JSX.Element>());
    const user = JSON.parse(localStorage.getItem("user")!);
    const colors = ['#512C2C', '#586E52', '#3C4E64', '#D9D9D9'];  // Set of colors for chat img

    const initializeChatList = async () => {
        let username = user.username;
        axios.post('http://localhost:8000/getAllChats', { username })
            .then(response => {
                // localStorage.setItem('chatList', JSON.stringify(response.data))
                let initialChatList = new Array<JSX.Element>();
                let rawChatList = response.data;
                rawChatList.map((chat: { chat_id: number, title: string, num_messages: number }) => {
                    let bgColor = colors[Math.floor(Math.random() * colors.length)];
                    initialChatList.push(
                        <li key={chat.chat_id}>
                            <ChatItem chatTitle={chat.title} numMessages={chat.num_messages} bgColor={bgColor} />
                        </li>
                    )
                })

                // response.data.forEach((chat: { chat_id: number, title: string, num_messages: number }) => {
                //     let bgColor = colors[Math.floor(Math.random() * colors.length)];
                //     initialChatList.push(
                //         <li key={chat.chat_id}>
                //             <ChatItem chatTitle={chat.title} numMessages={chat.num_messages} bgColor={bgColor} />
                //         </li>
                //     )
                // });

                setChatList(initialChatList)
            })
            .catch(function (error) {
                console.log("Error: " + error);
            })
    }

    useEffect(() => {
        initializeChatList();
    }, [])

    const addChatToChatList = (chatData: { chatId: number, chatTitle: string, numMessages: number }) => {
        // let currentChatList = chatList;
        let bgColor = colors[Math.floor(Math.random() * colors.length)];
        let newChat = <li key={chatData.chatId}> <ChatItem chatTitle={chatData.chatTitle} numMessages={chatData.numMessages} bgColor={bgColor} /></li>
        // currentChatList.push(newChat.props)
        setChatList([...chatList, newChat]);
        // window.location.reload();
    }

    return (
        <div>
            <div id="main-container" className='flex-row'>
                <div id="conversation-panel" className='flex-col dark-grey-bg'>
                    <div id="conversation-header">
                        <h3 className='light-grey-text'>Conversations</h3>
                    </div>
                    <div id="conversation-list">
                        <ul>
                            {chatList}
                            {/* {chatList.map(chat => <div>{chat}</div>)} */}
                        </ul>
                    </div>
                    <div id="conversation-footer">
                        <UploadFile chatDataCallback={addChatToChatList} />
                    </div>
                </div>
                <div id="chat-panel" className='flex-col light-grey-bg'>
                    chat
                </div>
            </div>
        </div>
    )
}

export default MainWindow;