// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import './MainWindow.css';
// import './Home.css';
import UploadFile from '../UploadFile/UploadFile';
import { useEffect, useState } from 'react';
import axios from 'axios';


function ChatItem({ chatId, chatTitle, numMessages }: { chatId: number, chatTitle: string, numMessages: number }) {
    const colors = ['#512C2C', '#586E52', '#3C4E64', '#D9D9D9'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    return (
        <div>
            <li key={chatId}>
                <div className="flex-row center chat-item-container">
                    <span className='flex-row center chat-item-img' style={{ backgroundColor: bgColor }}>
                    </span>
                    <div className="chat-item-details">
                        <h3 className='no-margin white-text'>{chatTitle}</h3>
                        <p className='thin white-text'>{numMessages} messages</p>
                    </div>
                </div>
            </li>
        </div>
    )
}

function MainWindow({ rawChatList }: { rawChatList: any }) {
    const [chatList, setChatList] = useState(Array<JSX.Element>());
    useEffect(() => {
        const initalChatList: Array<JSX.Element> = rawChatList.map((chatData: { chat_id: number, title: string, num_messages: number }) =>
                <ChatItem chatId={chatData.chat_id} chatTitle={chatData.title} numMessages={chatData.num_messages} />
        )
        setChatList(initalChatList)
    }, [])
    // TODO: sdafsdaf

    const addChatToChatList = (chatData: { chatId: number, chatTitle: string, numMessages: number }) => {
        let currentChatList = chatList.slice();
        let newChat = <ChatItem chatId={chatData.chatId} chatTitle={chatData.chatTitle} numMessages={chatData.numMessages} />
        currentChatList.push(newChat.props)
        setChatList(currentChatList);
        console.log(chatList);
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