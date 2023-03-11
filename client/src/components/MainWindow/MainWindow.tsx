// import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/general.css';
import './MainWindow.css';
// import './Home.css';
import UploadFile from '../UploadFile/UploadFile';


function MainWindow() {
    return (
        <div>
            <div id="main-container" className='flex-row'>
                <div id="conversation-panel" className='flex-col dark-grey-bg'>
                    <div id="conversation-header">
                        <h3 className='light-grey-text'>Conversations</h3>
                    </div>
                    <div id="conversation-list">
                        <div className='conversation-item'>item</div>
                        <div className='conversation-item'>item</div>
                        <div className='conversation-item'>item</div>
                    </div>
                    <div id="conversation-footer">
                        <UploadFile />
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