import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/general.css";
import "./SignUp-Login.css";
import "../../styles/form.css";
import { Link, useNavigate } from "react-router-dom";
import AppTitle from "../Header/AppTitle";
import { LAMBDA_CREATE_USER_URL } from "../../constants";

function SignUp() {
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
        navigate("/home");
    }

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const user = { username, password };
        // TODO: can we rename the lambda urls?
        axios
            .post(LAMBDA_CREATE_USER_URL, { username, password })
            .then(async (response) => {
                // console.log(response);
                // console.log(response.data);
                // var user = response.data;
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/home");
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.status === 409) {
                    alert("Username already taken.");
                }
            });
    };

    return (
        <div>
            <div className="container">
                <AppTitle username={user} />
            </div>
            <div id="form-container" className="flex-col">
                <h2 className="main-sage-text">Create an account</h2>
                <form onSubmit={submitForm} className="flex-col regular-spacing">
                    <div className="form-section">
                        <label className="main-sage-text" htmlFor="username">
                            Username
                        </label>
                        <input
                            required
                            minLength={6}
                            name="username"
                            className="light-sage-bg white-text"
                            placeholder="Enter a cool username"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-section">
                        <label className="main-sage-text" htmlFor="password">
                            Password
                        </label>
                        <input
                            required
                            minLength={8}
                            name="password"
                            className="light-sage-bg white-text"
                            placeholder="Enter a unique password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-section flex-row center">
                        <button id="submit-btn" className="btn flex-row center main-sage-bg white-text">
                            Create account
                        </button>
                    </div>
                </form>
                <p>
                    Already have an account?
                    <Link to="/login" className="no-underline main-sage-text">
                        {" "}
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
