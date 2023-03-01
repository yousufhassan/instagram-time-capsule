import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import { Link, useNavigate } from "react-router-dom";
import AppTitle from '../Header/AppTitle';

function Main() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")!);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const addChat = () => {
        axios.post('http://localhost:8000/addChat', { user })
            .then((response) => {
                console.log(response)
                // if (response.data === "Password incorrect!") {
                //     alert("Incorrect password given.")
                // }
                // else {
                //     localStorage.setItem('user', JSON.stringify(response.data));
                //     navigate('/home')
                // }
            })
            .catch(function (error) {
                console.log(error);
                // alert('Incorrect username or password.')
            });
    }

    return (
        <div>
            <div id="header">
                <AppTitle username={user.username} />
                <button onClick={handleLogout}>Log out</button>
                <button onClick={addChat}>Add chat</button>

            </div>
            <div id="main-container">
                {/* ConversationPanel Component */}
                {/* ChatPanel Component */}
            </div>
        </div>
    )
}

export default Main;