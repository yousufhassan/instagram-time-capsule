// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import './Home.css';
import { useNavigate } from "react-router-dom";
import AppTitle from '../Header/AppTitle';
import MainWindow from '../MainWindow/MainWindow';

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")!);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div>
            <div id="header" className='flex-row'>
                <div style={{flex: 1}}>
                <AppTitle username={user.username} />
                </div>
                <p id='logout' className='btn white-text regular-text flex-row center' onClick={handleLogout}>Log out</p>
            </div>
            <div>
                <MainWindow />
                {/* ConversationPanel Component */}
                {/* ChatPanel Component */}
            </div>
        </div>
    )
}

export default Home;