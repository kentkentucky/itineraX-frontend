import "./EditAccomodation.css";

import { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

import { AuthTokenContext } from "./App";
import NavBar from "./components/NavBar";

const libraries = ["places"];
const mapContainerStyle = {
  width: "80vw",
  height: "30vh",
};

function EditAccomodation() {
  const authTokenContext = useContext(AuthTokenContext);

  const { accomodationID } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cost, setCost] = useState(0);

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
        setName(response.data.name);
        setLocation(response.data.location);
        await geocodeLocation(response.data.location);
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

  const geocodeLocation = (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0].geometry) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          setCoordinates({ lat, lng });
          resolve({ lat, lng });
        } else {
          console.error("Geocode was not successful: ", status);
          reject(status);
        }
      });
    });
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries,
  });

  const autocompleteRef = useRef(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  };

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
    formData.append("accomodationID", accomodationID);
    formData.append("name", name);
    formData.append("location", location);
    formData.append("file", file);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("cost", cost);
    try {
      const response = await axios.put(
        "http://localhost:8080/accomodation/edit",
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
    <div className="edit-accomodation-container">
      <NavBar />
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <form className="form" onSubmit={handleSubmit}>
        <p>Name</p>
        <input type="text" onChange={handleName} value={name}></input>
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
          center={
            coordinates.lat ? coordinates : { lat: 1.3521, lng: 103.8198 }
          }
        >
          {coordinates.lat && <Marker position={coordinates} />}
        </GoogleMap>
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

export default EditAccomodation;
