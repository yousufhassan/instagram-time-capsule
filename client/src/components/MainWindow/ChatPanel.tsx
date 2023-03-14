import '../../styles/general.css';
import './ChatPanel.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

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


function ChatPanel() {
    return (
        <div>
            <div id="chat-panel-header" className='flex-row space-btwn'>
                <ChatTitle chatTitle='Maheerah' bgColor='red' />
                <div className="icons-container flex-row center">
                    <span className="material-symbols-outlined icon btn"> casino </span>
                    <span className="material-symbols-outlined icon btn"> info </span>
                    <span className="material-symbols-outlined icon btn" style={{color:"red"}}> delete </span>
                </div>
            </div>
            <div id="chat-area">
                Messages go here
            </div>
        </div>
    )
}

export default ChatPanel;