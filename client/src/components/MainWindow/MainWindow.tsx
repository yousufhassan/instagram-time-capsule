import '../../styles/general.css';
import './MainWindow.css';
import ConversationPanel from './CoversationsPanel';
import ChatPanel from './ChatPanel';
import { useState } from 'react';


function MainWindow() {
    const user = JSON.parse(localStorage.getItem("user")!);
    const [activeChat, setActiveChat] = useState(Object());
    console.log(activeChat);
    
    return (
        <div>
            <div id="main-container" className='flex-row'>
                <div id="conversation-panel-container" className='flex-col dark-grey-bg'>
                    <ConversationPanel setActiveChat={setActiveChat}/>
                </div>
                <div id="chat-panel-container" className='flex-col light-grey-bg'>
                    <ChatPanel activeChat={activeChat}/>
                </div>
            </div>
        </div>
    )
}

export default MainWindow;