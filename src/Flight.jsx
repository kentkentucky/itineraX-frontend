import "./Flight.css";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";

function Flight() {
  const authTokenContext = useContext(AuthTokenContext);

  const { flightID } = useParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [flight, setFlight] = useState([]);

  useEffect(() => {
    getFlight();
  }, []);

  const getFlight = async () => {
    try {
      const response = await axios.get("http://localhost:8080/flight", {
        params: { flightID },
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setUrl(response.data.url);
        setFlight(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        "http://localhost:8080/flight/delete",
        {
          params: { flightID },
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
          },
        }
      );
      if (response) {
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flight-container">
      <NavBar />
      <div className="banner">
        {url && <img src={url} className="img-banner" />}
      </div>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      {flight && (
        <div className="flight-info">
          <div className="ticket-header">
            <h3>{flight.flight?.name}</h3>
            <button className="delete-btn" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <span className="flight-number">{flight.details?.number}</span>
          <div className="ticket-body">
            <div className="ticket-section">
              <h3>Departure</h3>
              <p>Airport: {flight.details?.departure?.airport?.name}</p>
              <p>Terminal: {flight.details?.departure?.terminal}</p>
              <p>Check In Desk: {flight.details?.departure?.checkInDesk}</p>
              <p>
                Scheduled Time:{" "}
                {flight.details?.departure?.scheduledTime?.local
                  ? format(
                      new Date(flight.details?.departure.scheduledTime.local),
                      "EEE, MMM d, yyyy h:mm a"
                    )
                  : "N/A"}
              </p>
              <p>
                Revised Time:{" "}
                {flight.details?.departure?.revisedTime?.local
                  ? format(
                      new Date(flight.details?.departure.revisedTime.local),
                      "EEE, MMM d, yyyy h:mm a"
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="ticket-divider">✈</div>
            <div className="ticket-section">
              <h3>Arrival</h3>
              <p>Airport: {flight.details?.arrival?.airport?.name}</p>
              <p>Terminal: {flight.details?.arrival?.terminal}</p>
              <p>
                Scheduled Time:{" "}
                {flight.details?.arrival?.scheduledTime?.local
                  ? format(
                      new Date(flight.details?.arrival?.scheduledTime?.local),
                      "EEE, MMM d, yyyy h:mm a"
                    )
                  : "N/A"}
              </p>
              <p>
                Predicted Time:{" "}
                {flight.details?.arrival?.predictedTime?.local
                  ? format(
                      new Date(flight.details?.arrival?.predictedTime?.local),
                      "EEE, MMM d, yyyy h:mm a"
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
          <a href={flight.flight?.image} target="_blank" rel="noreferrer">
            {flight.flight?.image}
          </a>
        </div>
      )}
    </div>
  );
}

export default Flight;
