import "./AddInsurance.css";

import { useState, useContext } from "react";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";
import { useNavigate } from "react-router";
import axios from "axios";

function AddInsurance() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cost, setCost] = useState(0);

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
    formData.append("name", name);
    formData.append("file", file);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("cost", cost);
    try {
      const response = await axios.post(
        "http://localhost:8080/insurance/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "multipart/form-data",
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
    <div className="add-insurance-container">
      <NavBar />
      <form className="insurance-form" onSubmit={handleSubmit}>
        <p>Name</p>
        <input type="text" onChange={handleName}></input>
        <p>Image</p>
        <input
          type="file"
          className="file-upload"
          accept="image/*,.jpg,.jpeg,.pdf"
          onChange={handleFile}
        ></input>
        {preview && <img src={preview} width="200" />}
        <p>Start Date</p>
        <input type="datetime-local" onChange={handleStartDate}></input>
        <p>End Date</p>
        <input type="datetime-local" onChange={handleEndDate}></input>
        <p>Cost</p>
        <input type="number" min="0" step="0.01" onChange={handleCost}></input>
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddInsurance;
