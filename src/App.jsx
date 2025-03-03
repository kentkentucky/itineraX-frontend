import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";

import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import CreateItinerary from "./CreateItinerary";
import Itinerary from "./Itinerary";
import AddFlight from "./AddFlight";
import Flight from "./Flight";
import AddAccomodation from "./AddAccomodation";
import Accomodation from "./Accomodation";
import AddRental from "./AddRental";
import Rental from "./Rental";
import AddInsurance from "./AddInsurance";
import Insurance from "./Insurance";
import EditAccomodation from "./EditAccomodation";
import EditRental from "./EditRental";
import EditInsurance from "./EditInsurance";
import AddEvent from "./AddEvent";
import AddTicket from "./AddTicket";
import EditEvent from "./EditEvent";
import Archive from "./Archive";

export const AuthTokenContext = createContext();

function App() {
  const [authToken, setAuthToken] = useState("");

  return (
    <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/itinerary/create" element={<CreateItinerary />} />
          <Route path="/itinerary/:itineraryID" element={<Itinerary />} />
          <Route path="/flight/add" element={<AddFlight />} />
          <Route path="/flight/:flightID" element={<Flight />} />
          <Route path="/accomodation/add" element={<AddAccomodation />} />
          <Route
            path="/accomodation/:accomodationID"
            element={<Accomodation />}
          />
          <Route path="/rental/add" element={<AddRental />} />
          <Route path="/rental/:rentalID" element={<Rental />} />
          <Route path="/insurance/add" element={<AddInsurance />} />
          <Route path="/insurance/:insuranceID" element={<Insurance />} />
          <Route
            path="/accomodation/:accomodationID/edit"
            element={<EditAccomodation />}
          />
          <Route path="/rental/:rentalID/edit" element={<EditRental />} />
          <Route
            path="/insurance/:insuranceID/edit"
            element={<EditInsurance />}
          />
          <Route
            path="/itinerary/:itineraryID/event/add"
            element={<AddEvent />}
          />
          <Route path="/event/:eventID/ticket/add" element={<AddTicket />} />
          <Route path="/event/:eventID/edit" element={<EditEvent />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </BrowserRouter>
    </AuthTokenContext.Provider>
  );
}

export default App;
