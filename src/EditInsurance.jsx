import "./EditInsurance.css";

import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { AuthTokenContext } from "./App";
import NavBar from "./components/NavBar";

function EditInsurance() {
  const authTokenContext = useContext(AuthTokenContext);

  const { insuranceID } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cost, setCost] = useState(0);

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
        setName(response.data.name);
        setFile(response.data.image);
        setPreview(response.data.image);
        setStartDate(response.data.start);
        setEndDate(response.data.end);
        setCost(response.data.cost);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  };

  const handleName = (e) => setName(e.target.value);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleStartDate = (e) => setStartDate(e.target.value);

  const handleEndDate = (e) => setEndDate(e.target.value);

  const handleCost = (e) => setCost(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("insuranceID", insuranceID);
    formData.append("name", name);
    formData.append("file", file);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("cost", cost);
    try {
      const response = await axios.put(
        "http://localhost:8080/insurance/edit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "multi-part/form-data",
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

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="edit-insurance-container">
      <NavBar />
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <form className="form" onSubmit={handleSubmit}>
        <p>Name</p>
        <input type="text" onChange={handleName} value={name}></input>
        <p>Image</p>
        <input
          type="file"
          className="file-upload"
          accept="image/*,.jpg,.jpeg,.pdf"
          onChange={handleFile}
        ></input>
        {preview && <img src={preview} width="200" />}
        <p>Start Date</p>
        <input
          type="datetime-local"
          onChange={handleStartDate}
          value={formatDateForInput(startDate)}
        ></input>
        <p>End Date</p>
        <input
          type="datetime-local"
          onChange={handleEndDate}
          value={formatDateForInput(endDate)}
        ></input>
        <p>Cost</p>
        <input
          type="number"
          min="0"
          step="0.01"
          onChange={handleCost}
          value={cost}
        ></input>
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default EditInsurance;
