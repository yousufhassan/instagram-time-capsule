// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import './MainWindow.css';
// import './Home.css';
import UploadFile from '../UploadFile/UploadFile';
import { useEffect, useState } from 'react';
import axios from 'axios';


function ChatItem({chatTitle, numMessages }: {chatTitle: string, numMessages: number }) {
    const colors = ['#512C2C', '#586E52', '#3C4E64', '#D9D9D9'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
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
    const [chatList, setChatList] = useState(Array<JSX.Element>);
    const [firstRender, setFirstRender] = useState(true)

    const initializeChatList = async () => {

        axios.get('http://localhost:8000/getAllChats')
            .then(response => {
                const initalChatList: Array<JSX.Element> = (response.data).map((chatData: { chat_id: number, title: string, numMessages: number }) =>
                    <li key={chatData.chat_id}>
                        <ChatItem chatTitle={chatData.title} numMessages={chatData.numMessages} />
                    </li>
                )
                console.log(initalChatList);
                setChatList(initalChatList);
                // return initalChatList;
            })
        console.log("reached");
    }

    if (firstRender) {
        console.log("first render");
        setFirstRender(false)
        initializeChatList();
    }


    const addChatToChatList = (chatData: { chatTitle: string, numMessages: number }) => {
        // console.log(chatData.chatTitle);
        // let newChat = <ChatItem chatTitle={chatData.chatTitle} numMessages={chatData.numMessages} />
        // setNewChat(chatData);
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