import "./Profile.css";

import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";

import { AuthTokenContext } from "./App";
import NavBar from "./components/NavBar";

function Profile() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:8080/user/profile",
        { username },
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="profile-container">
      <NavBar />
      <form className="profile-form" onSubmit={handleSubmit}>
        <p>Username</p>
        <input type="text" onChange={handleChange}></input>
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default Profile;
