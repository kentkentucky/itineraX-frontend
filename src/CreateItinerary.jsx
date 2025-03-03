import "./CreateItinerary.css";

import { useNavigate } from "react-router";
import { useState, useContext } from "react";
import axios from "axios";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";

function CreateItinerary() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/itinerary/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        navigate(`/itinerary/${response.data}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-itinerary-container">
      <NavBar />
      <form className="itinerary-form" onSubmit={handleSubmit}>
        <p>Itinerary Name</p>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Graduation Trip!"
        ></input>
        <button type="submit" className="create-btn">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateItinerary;
