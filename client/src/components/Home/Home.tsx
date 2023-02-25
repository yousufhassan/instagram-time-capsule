import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import { Link, useNavigate } from "react-router-dom";
import AppTitle from '../Header/AppTitle';

function Main() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")!);
    console.log(user.username);
    

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
      };
    return (
        <div>
            <div id="header">
                <AppTitle username={user.username}/>
                <button onClick={handleLogout}>Log out</button>
            </div>
            <div id="main-container">
                {/* ConversationPanel Component */}
                {/* ChatPanel Component */}
            </div>
        </div>
    )
}

export default Main;