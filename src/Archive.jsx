import "./Archive.css";

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";

function Archive() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const [archives, setArchives] = useState([]);

  useEffect(() => {
    getArchives();
  }, []);

  const getArchives = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/itinerary/archives",
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
          },
        }
      );
      if (response) {
        setArchives(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchive = (e, itineraryID) => {
    e.preventDefault();
    navigate(`/itinerary/${itineraryID}`);
  };

  return (
    <div className="archive-container">
      <NavBar />
      {archives && (
        <ul className="archive-list">
          <h5>Archived Itineraries</h5>
          {archives.map((archive) => (
            <li key={archive.Itinerary.id}>
              <button
                className="archive-itinerary-btn"
                onClick={(e) => {
                  handleArchive(e, archive.Itinerary.id);
                }}
              >
                <h5>{archive.Itinerary.name}</h5>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Archive;
