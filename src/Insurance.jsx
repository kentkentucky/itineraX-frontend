import "./Insurance.css";

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

function Insurance() {
  const authTokenContext = useContext(AuthTokenContext);

  const { insuranceID } = useParams();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [insurance, setInsurance] = useState([]);

  useEffect(() => {
    getInsurance();
  }, []);

  const getInsurance = async () => {
    try {
      const response = await axios.get("http://localhost:8080/insurance", {
        params: { insuranceID },
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setInsurance(response.data.insurance);
        setUrl(response.data.url);
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
        "http://localhost:8080/insurance/delete",
        {
          params: { insuranceID },
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

  const handleEdit = async (e) => {
    e.preventDefault();
    navigate(`/insurance/${insuranceID}/edit`);
  };

  return (
    <div className="insurance-container">
      <NavBar />
      <div className="banner">
        {url && <img src={url} className="img-banner" />}
      </div>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      {insurance && (
        <div className="insurance-info">
          <div className="ticket-header">
            <h3>{insurance.name}</h3>
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
            <p>
              Start:{" "}
              {insurance.start
                ? format(new Date(insurance.start), "EEE, MMM d, yyyy h:mm a")
                : "N/A"}
            </p>
            <p>
              End:{" "}
              {insurance.end
                ? format(new Date(insurance.end), "EEE, MMM d, yyyy h:mm a")
                : "N/A"}
            </p>
            <p>Cost: {insurance.cost}</p>
            <p>
              Image:{" "}
              <a href={insurance.image} target="_blank" rel="noreferrer">
                {insurance.image}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Insurance;
