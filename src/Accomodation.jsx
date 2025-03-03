import "./Accomodation.css";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";

function Accomodation() {
  const authTokenContext = useContext(AuthTokenContext);

  const { accomodationID } = useParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [accomodation, setAccomodation] = useState([]);

  useEffect(() => {
    getAccomodation();
  }, []);

  const getAccomodation = async () => {
    try {
      const response = await axios.get("http://localhost:8080/accomodation", {
        params: { accomodationID },
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setAccomodation(response.data.accomodation);
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
    navigate(`/accomodation/${accomodationID}/edit`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        "http://localhost:8080/accomodation/delete",
        {
          params: { accomodationID },
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
    <div className="accomodation-container">
      <NavBar />
      <div className="banner">
        {url && <img src={url} className="img-banner" />}
      </div>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      {accomodation && (
        <div className="accomodation-info">
          <div className="ticket-header">
            <h3>{accomodation.name}</h3>
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
            <LocationLink address={accomodation.location} />
            <p>
              Check In:{" "}
              {accomodation.start
                ? format(
                    new Date(accomodation.start),
                    "EEE, MMM d, yyyy h:mm a"
                  )
                : "N/A"}
            </p>
            <p>
              Check Out:{" "}
              {accomodation.end
                ? format(new Date(accomodation.end), "EEE, MMM d, yyyy h:mm a")
                : "N/A"}
            </p>
            <p>Cost: {accomodation.cost}</p>
            <p>
              Image:{" "}
              <a href={accomodation.image} target="_blank" rel="noreferrer">
                {accomodation.image}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accomodation;
