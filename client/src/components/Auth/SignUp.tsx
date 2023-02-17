import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import './SignUp-Login.css';
import '../../styles/form.css';
import '../../styles/button.css';
import { Link, useNavigate } from "react-router-dom";



function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:8000/createUser', { username, password })
            .then((response) => {
                console.log(response.data)
                navigate('/home')
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.status === 409) {
                    alert('Username already taken.');
                }
            });
    }

    return (
        <div>
            <div id="app-name">Instagram Time Capsule</div>
            <div id="form-container" className='flex-col'>
                <h2 className='main-sage-text'>Create an account</h2>
                <form onSubmit={submitForm} className="flex-col regular-spacing">
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="username">Username</label>
                        <input required minLength={6} name='username' className='light-sage-bg white-text'
                            placeholder='Enter a cool username' type="text"
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="password">Password</label>
                        <input required minLength={8} name='password' className='light-sage-bg white-text'
                            placeholder='Enter a unique password' type="password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-section flex-row center">
                        <button id='submit-btn' className='btn flex-row center main-sage-bg white-text'>
                            Create account
                        </button>
                    </div>
                </form>
                <p>Already have an account?
                    <Link to="/login" className='no-underline main-sage-text'> Log in</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp;