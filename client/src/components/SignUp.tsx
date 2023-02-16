import axios from 'axios';
import { useState } from 'react';
import '.././styles/general.css';
import '.././styles/SignUp-Login.css';
import '.././styles/form.css';
import '.././styles/button.css';
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
    interface account {
        username: string
        password: string
    }

    const navigate = useNavigate();
    const [userAccount, setAccount] = useState<account>({ username: "", password: "" })

    const sumbitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log(account);

        axios.post('http://localhost:8000/createUser', userAccount)
            .then((response) => {
                console.log(response.data)
                navigate('/home')
            })
            .catch(function (error) {
                // Account not created, most likley due to username already taken
                alert("Username already taken")
                console.log(error);
            });
    }

    const onChangeHandler = (event: HTMLInputElement) => {
        const { name, value } = event
        setAccount((prev) => {
            return { ...prev, [name]: value }
        })
    }

    return (
        <div>
            <div id="app-name">Instagram Time Capsule</div>
            <div id="form-container" className='flex-col'>
                <h2 className='main-sage-text'>Create an account</h2>
                <form onSubmit={sumbitForm} className="flex-col regular-spacing">
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="username">Username</label>
                        <input required minLength={6} name='username' className='light-sage-bg white-text'
                            placeholder='Enter a cool username' type="text"
                            onChange={(e) => onChangeHandler(e.target)} />
                    </div>
                    <div className="form-section">
                        <label className='main-sage-text' htmlFor="password">Password</label>
                        <input required minLength={8} name='password' className='light-sage-bg white-text'
                            placeholder='Enter a unique password' type="text"
                            onChange={(e) => onChangeHandler(e.target)} />
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
        </div >
    )
}

export default SignUp;