import "./Profile.css";

import axios from "axios";

import NavBar from "./components/NavBar";

function Profile() {
  return (
    <div className="profile-container">
      <NavBar />
      <form className="profile-form">
        <p>Username</p>
        <input type="text"></input>
        <button className="save-btn">Save</button>
      </form>
    </div>
  );
}

export default Profile;
