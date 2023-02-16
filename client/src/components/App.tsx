import React from 'react';
import '.././styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route index element={} /> */}
          <Route path="sign-up" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

