import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";

import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";

export const AuthTokenContext = createContext();

function App() {
  const [authToken, setAuthToken] = useState("");

  return (
    <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthTokenContext.Provider>
  );
}

export default App;
