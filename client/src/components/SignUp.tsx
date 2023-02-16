import React, { Component, ChangeEvent } from 'react';
import axios from 'axios';
// import { useState } from 'react';
import '.././styles/general.css';
import '.././styles/SignUp-Login.css';
import '.././styles/form.css';
import '.././styles/button.css';
import { Link, useNavigate } from "react-router-dom";

class SignUp extends Component {
    constructor(props: any) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.sumbitForm = this.sumbitForm.bind(this);
    }

    sumbitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        axios.post('http://localhost:8000/createUser', this.state)
            .then((response) => {
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.status == 409) {
                    alert('Username already taken');
                }
            });
    }

    usernameChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            username: e.target.value
        })
    }

    passwordChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: e.target.value
        })
    }

    render() {
        return (
            <div>
                <div id="app-name">Instagram Time Capsule</div>
                <div id="form-container" className='flex-col'>
                    <h2 className='main-sage-text'>Create an account</h2>
                    <form onSubmit={this.sumbitForm} className="flex-col regular-spacing">
                        <div className="form-section">
                            <label className='main-sage-text' htmlFor="username">Username</label>
                            <input required minLength={6} name='username' className='light-sage-bg white-text'
                                placeholder='Enter a cool username' type="text"
                                onChange={(e) => this.usernameChangeHandler(e)} />
                        </div>
                        <div className="form-section">
                            <label className='main-sage-text' htmlFor="password">Password</label>
                            <input required minLength={8} name='password' className='light-sage-bg white-text'
                                placeholder='Enter a unique password' type="text"
                                onChange={(e) => this.passwordChangeHandler(e)} />
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
}

export default SignUp;