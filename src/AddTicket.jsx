import "./AddTicket.css";

import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";

function AddTicket() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();
  const { eventID } = useParams();

  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState("");
  const [cost, setCost] = useState(0);

  useEffect(() => {
    getTypes();
  }, []);

  const getTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/ticket/add", {
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setTypes(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleName = (e) => setName(e.target.value);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCost = (e) => setCost(e.target.value);

  const handleType = (e) => setType(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eventID", eventID);
    formData.append("name", name);
    formData.append("file", file);
    formData.append("cost", cost);
    formData.append("type", type);
    try {
      const response = await axios.post(
        "http://localhost:8080/ticket/add",
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
    <div className="add-ticket-container">
      <NavBar />
      <form className="form" onSubmit={handleSubmit}>
        <p>Name</p>
        <input type="text" onChange={handleName}></input>
        <p>Image</p>
        <input
          type="file"
          className="file-upload"
          accept="image/*"
          onChange={handleFile}
        ></input>
        {file && <img src={preview} width="200" />}
        <p>Type</p>
        <select onChange={handleType} className="type-dropdown">
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.category}
            </option>
          ))}
        </select>
        <p>Cost</p>
        <input type="number" min="0" step="0.01" onChange={handleCost}></input>
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTicket;
