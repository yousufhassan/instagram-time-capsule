import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import { Link, useNavigate } from "react-router-dom";
import AppTitle from '../Header/AppTitle';

function Main() {

    return (
        <div>
            <div id="header">
                <AppTitle username="User"/>
                <button>Log out</button>
            </div>
            <div id="main-container">
                {/* ConversationPanel Component */}
                {/* ChatPanel Component */}
            </div>
        </div>
    )
}

export default Main;