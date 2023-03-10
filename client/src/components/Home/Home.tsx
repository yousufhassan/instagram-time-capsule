// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import { useNavigate } from "react-router-dom";
import AppTitle from '../Header/AppTitle';
import UploadFile from '../UploadFile/UploadFile';

function Main() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")!);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };


    return (
        <div>
            <div id="header">
                <AppTitle username={user.username} />
                <button onClick={handleLogout}>Log out</button>
                <br />
                <br />
                <UploadFile />

            </div>
            <div id="main-container">
                {/* ConversationPanel Component */}
                {/* ChatPanel Component */}
            </div>
        </div>
    )
}

export default Main;