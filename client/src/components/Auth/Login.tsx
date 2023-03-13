import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/general.css';
import './SignUp-Login.css';
import '../../styles/form.css';
import { Link, useNavigate } from "react-router-dom";
import AppTitle from '../Header/AppTitle';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    }, []);

    // If a user is already logged in, redirect to the home page
    if (Object.keys(user).length !== 0) {
        navigate('/home')
    }

    const initializeChatList = async () => {
        axios.get('http://localhost:8000/getAllChats')
            .then(response => {
                localStorage.setItem('chatList', JSON.stringify(response.data))
            })
            .catch(function (error) {
                console.log("Error: " + error);
            })
    }

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:8000/login', { username, password })
            .then(async(response) => {
                // console.log(response)
                if (response.data === "Password incorrect!") {
                    alert("Incorrect password given.")
                }
                else {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    await initializeChatList();
                    navigate('/home')
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('Incorrect username or password.')
            });
    }

    return (
        <div>
            <div className='container'>
                <AppTitle username={user} />
            </div>
            <div id="form-container" className='flex-col'>
                <h2 className='main-sage-text'>Log in</h2>
                <form onSubmit={submitForm} className='flex-col regular-spacing'>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="username">Username</label>
                        <input required minLength={6} name='username' className='light-sage-bg white-text'
                            placeholder='Enter your cool username' type="text"
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="password">Password</label>
                        <input required minLength={8} name='password' className='light-sage-bg white-text'
                            placeholder='Enter your unique password' type="password"
                            onChange={(e) => setPassword(e.target.value)} />
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