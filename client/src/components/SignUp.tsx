import React from 'react';
import '.././styles/general.css';
import '.././styles/SignUp-Login.css';
import '.././styles/form.css';
import '.././styles/button.css';
import { Link } from "react-router-dom";

function SignUp() {
    return (
        <div>
            <div id="app-name">Instagram Time Capsule</div>
            <div id="form-container" className='flex-col'>
                <h2 className='main-sage-text'>Create an account</h2>
                <div id="form" className='flex-col regular-spacing'>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="username">Username</label>
                        <input className='light-sage-bg white-text' placeholder='Enter a cool username' type="text" />
                    </div>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="password">Password</label>
                        <input className='light-sage-bg white-text' placeholder='Enter a unique password' type="text" />
                    </div>
                    <div className="form-section flex-row center">
                        <input className='btn flex-row center main-sage-bg white-text' id='submit-btn' type="button" value="Create account" />
                    </div>
                </div>
                <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
        </div >
    )
}

export default SignUp;