// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import './Home.css';
import { useNavigate } from "react-router-dom";
import AppTitle from '../Header/AppTitle';
import MainWindow from '../MainWindow/MainWindow';
import { useEffect, useState } from 'react';

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")!);

    const [rawChatList, setRawChatList] = useState(() => {
        return JSON.parse(localStorage.getItem("chatList")!)
    })
    
    // For some reason rawChatList is null after user login or sign up, but a page reload
    // will get the actual values. This is what this if statement does.
    if (rawChatList === null) {
        window.location.reload();
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div>
            <div id='page-container' className='flex-col'>
                <div id="header" className='flex-row'>
                    <div style={{ flex: 1 }}>
                        <AppTitle username={user.username} />
                    </div>
                    <p id='logout' className='btn white-text regular-text flex-row center' onClick={handleLogout}>Log out</p>
                </div>
                <div id='container' className='flex-row center'>
                    <MainWindow rawChatList={rawChatList} />
                    {/* ConversationPanel Component */}
                    {/* ChatPanel Component */}
                </div>
            </div>
        </div>
    )
}

export default Home;