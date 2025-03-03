import "./AddEvent.css";

import { useState, useRef, useContext } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

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

function AddEvent() {
  const authTokenContext = useContext(AuthTokenContext);

  const { itineraryID } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(center);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const handleStartDate = (e) => setStartDate(e.target.value);

  const handleEndDate = (e) => setEndDate(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/event/add",
        { itineraryID, name, location, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "application/json",
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
    <div className="add-event-container">
      <NavBar />
      <form className="form" onSubmit={handleSubmit}>
        <h3>Add Event</h3>
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
        <p>Start Date</p>
        <input type="datetime-local" onChange={handleStartDate}></input>
        <p>End Date</p>
        <input type="datetime-local" onChange={handleEndDate}></input>
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddEvent;
