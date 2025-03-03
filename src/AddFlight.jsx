import "./AddFlight.css";

import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";

function AddFlight() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cost, setCost] = useState(0);

  const handleName = (e) => setName(e.target.value);

  const handleNumber = (e) => setNumber(e.target.value);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCost = (e) => setCost(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("number", number);
    formData.append("file", file);
    formData.append("cost", cost);
    try {
      const response = await axios.post(
        "http://localhost:8080/flight/add",
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
    <div className="add-flight-container">
      <NavBar />
      <form className="flight-form" onSubmit={handleSubmit}>
        <p>Name</p>
        <input type="text" onChange={handleName}></input>
        <p>Flight Number</p>
        <input type="text" onChange={handleNumber}></input>
        <p>Image</p>
        <input
          type="file"
          className="file-upload"
          accept="image/*"
          onChange={handleFile}
        ></input>
        {file && <img src={preview} width="200" />}
        <p>Cost</p>
        <input type="number" min="0" step="0.01" onChange={handleCost}></input>
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddFlight;
