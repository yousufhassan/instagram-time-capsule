import React from 'react';
import '.././styles/general.css';
import '.././styles/SignUp-Login.css';
import '.././styles/form.css';
import '.././styles/button.css';
import { Link } from "react-router-dom";

function Login() {
    return (
        <div>
            <div id="app-name">Instagram Time Capsule</div>
            <div id="form-container" className='flex-col'>
                <h2 className='main-sage-text'>Log in</h2>
                <form action="" className='flex-col regular-spacing'>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="username">Username</label>
                        <input className='light-sage-bg white-text' placeholder='Enter your cool username' type="text" />
                    </div>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="password">Password</label>
                        <input className='light-sage-bg white-text' placeholder='Enter your unique password' type="text" />
                    </div>
                    <div className="form-section flex-row center">
                        {/* <input className='btn flex-row center main-sage-bg white-text' id='submit-btn' type="button" value="Log in" /> */}
                        <button id='submit-btn' className='btn flex-row center main-sage-bg white-text'>Log in</button>
                    </div>
                </form>
                <p>Don't have an account? <Link to="/sign-up" className='no-underline main-sage-text'>Sign up</Link></p>
            </div>
        </div >
    )
}

export default Login;