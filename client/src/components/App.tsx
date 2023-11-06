import React from "react";
import ".././styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import Home from "./Home/Home";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    {/* <Route index element={} /> */}
                    <Route path="sign-up" element={<SignUp />} />
                    <Route path="login" element={<Login />} />
                    <Route path="home" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
