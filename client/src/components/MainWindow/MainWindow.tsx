// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import './MainWindow.css';
// import './Home.css';
import UploadFile from '../UploadFile/UploadFile';
import { useState } from 'react';


function ChatItem({ chatTitle, numMessages }: { chatTitle: string, numMessages: number }) {
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
    const initializeChatList = (): JSX.Element[] => {
        // Make get request to get an array of all chats that this user has

        // Call setChatList and set it to this array

        // temp code
        let chatList = [];
        chatList.push(<ChatItem chatTitle='Jim Halpert' numMessages={3209} />)
        chatList.push(<ChatItem chatTitle='Pam Beesly' numMessages={850} />)
        return chatList
    }

    const addChatToChatList = (chatData: { chatTitle: string, numMessages: number }) => {
        // console.log(chatData.chatTitle);
        // let newChat = <ChatItem chatTitle={chatData.chatTitle} numMessages={chatData.numMessages} />
        // setNewChat(chatData);
    }

    const initialChatList = initializeChatList()
    const [chatList, setChatList] = useState(initialChatList);


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