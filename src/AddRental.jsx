import "./AddRental.css";

import { useState, useRef, useContext } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";

const libraries = ["places"];
const mapContainerStyle = {
  width: "80vw",
  height: "30vh",
};
const center = {
  lat: 1.3521,
  lng: 103.8198,
};

function AddRental() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(center);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cost, setCost] = useState(0);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries,
  });

  const autocompleteRef = useRef(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const handleName = (e) => setName(e.target.value);

  const handleLocation = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCoordinates({ lat, lng });
        setLocation(place.formatted_address);
      }
    }
  };

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
    formData.append("location", location);
    formData.append("file", file);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("cost", cost);
    try {
      const response = await axios.post(
        "http://localhost:8080/rental/add",
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
    <div className="add-rental-container">
      <NavBar />
      <form className="rental-form" onSubmit={handleSubmit}>
        <p>Name</p>
        <input type="text" onChange={handleName}></input>
        <p>Location</p>
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handleLocation}
        >
          <input
            className="location-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={coordinates}
        >
          <Marker position={coordinates} />
        </GoogleMap>
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

export default AddRental;
