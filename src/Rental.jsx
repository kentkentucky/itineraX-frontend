import "./Rental.css";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { AuthTokenContext } from "./App";
import NavBar from "./components/NavBar";
import { Navbar } from "react-bootstrap";

function Rental() {
  const authTokenContext = useContext(AuthTokenContext);

  const { rentalID } = useParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [rental, setRental] = useState([]);

  useEffect(() => {
    getRental();
  }, []);

  const getRental = async () => {
    try {
      const response = await axios.get("http://localhost:8080/rental", {
        params: { rentalID },
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setRental(response.data.rental);
        setUrl(response.data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const LocationLink = ({ address }) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

    return (
      <p>
        Location:{" "}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          {address}
        </a>
      </p>
    );
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    navigate(`/rental/${rentalID}/edit`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        "http://localhost:8080/rental/delete",
        {
          params: { rentalID },
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
    <div className="rental-container">
      <Navbar />
      <div className="banner">
        {url && <img src={url} className="img-banner" />}
      </div>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      {rental && (
        <div className="rental-info">
          <div className="ticket-header">
            <h3>{rental.name}</h3>
            <span>
              <div className="btn-container">
                <button className="edit-btn" onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </span>
          </div>
          <div className="ticket-body">
            <LocationLink address={rental.location} />
            <p>
              Start:{" "}
              {rental.start
                ? format(new Date(rental.start), "EEE, MMM d, yyyy h:mm a")
                : "N/A"}
            </p>
            <p>
              End:{" "}
              {rental.end
                ? format(new Date(rental.end), "EEE, MMM d, yyyy h:mm a")
                : "N/A"}
            </p>
            <p>Cost: {rental.cost}</p>
            <p>
              Image:{" "}
              <a href={rental.image} target="_blank" rel="noreferrer">
                {rental.image}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rental;
