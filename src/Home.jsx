import "./Home.css";

import { useEffect, useState, useContext } from "react";
import axios from "axios";

import { AuthTokenContext } from "./App";

import NavBar from "./components/NavBar";
import { use } from "react";

function Home() {
  const authTokenContext = useContext(AuthTokenContext);

  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    getHome();
  }, []);

  const getHome = async () => {
    try {
      const response = await axios.get("http://localhost:8080/home", {
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setUsername(response.data.username);
        setUrl(response.data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home-container">
      <NavBar />
      <div className="banner">
        {url && <img src={url} className="img-home" />}
        <div className="phrase">
          <span>Welcome back...</span>
          <span>{username}</span>
        </div>
      </div>
      <div className="itinerary-container">
        <h2>Itineraries</h2>
      </div>
    </div>
  );
}

export default Home;
