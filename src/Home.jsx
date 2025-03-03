import "./Home.css";
import "react-tabs-scrollable/dist/rts.css";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faArchive } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { format } from "date-fns";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import Popup from "reactjs-popup";

import { AuthTokenContext } from "./App";
import NavBar from "./components/NavBar";
import TabPanel from "./components/TabPanel";

function Home() {
  const authTokenContext = useContext(AuthTokenContext);

  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [itineraries, setItineraries] = useState([]);
  const [flights, setFlights] = useState([]);
  const [accomodations, setAccomodations] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [invites, setInvite] = useState([]);

  const [value, setValue] = useState(0);

  const [pieChartData, setPieChartData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const categoryColors = {
    Flights: "#FF0000",
    Accommodations: "#0000FF",
    Rentals: "#FFFF00",
    Insurances: "#00FF00",
  };

  const [open, setOpen] = useState(false);
  const [receiverID, setReceiverID] = useState("");
  const [itineraryID, setItineraryID] = useState("");
  const [message, setMessage] = useState("");

  const [showPopup, setShowPopup] = useState(true);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getHome();
  }, []);

  useEffect(() => {
    getHome();
  }, [refresh]);

  useEffect(() => {
    const costs = calculateCosts();
    setPieChartData(costs);
  }, [flights, accomodations, rentals, insurances]);

  const getHome = async () => {
    try {
      const response = await axios.get("http://localhost:8080/home", {
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setUsername(response.data.username);
        setUrl(response.data.url);
        setItineraries(response.data.itineraries);
        setFlights(response.data.flights);
        setAccomodations(response.data.accomodations);
        setRentals(response.data.rentals);
        setInsurances(response.data.insurances);
        setInvite(response.data.invite);
        setRefresh(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateCosts = () => {
    const totalFlights = flights.reduce(
      (total, flight) => total + (flight.cost || 0),
      0
    );
    const totalAccommodations = accomodations.reduce(
      (total, accommodation) => total + (accommodation.cost || 0),
      0
    );
    const totalRentals = rentals.reduce(
      (total, rental) => total + (rental.cost || 0),
      0
    );
    const totalInsurances = insurances.reduce(
      (total, insurance) => total + (insurance.cost || 0),
      0
    );

    setTotalCost(
      totalFlights + totalAccommodations + totalRentals + totalInsurances
    );

    return [
      { category: "Flights", cost: totalFlights },
      { category: "Accommodations", cost: totalAccommodations },
      { category: "Rentals", cost: totalRentals },
      { category: "Insurances", cost: totalInsurances },
    ];
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleItinerary = (e, itineraryID) => {
    e.preventDefault();
    navigate(`/itinerary/${itineraryID}`);
  };

  const handleFlight = (e, flightID) => {
    e.preventDefault();
    navigate(`/flight/${flightID}`);
  };

  const handleAccomodation = (e, accomodationID) => {
    e.preventDefault();
    navigate(`/accomodation/${accomodationID}`);
  };

  const handleRental = (e, rentalID) => {
    e.preventDefault();
    navigate(`/rental/${rentalID}`);
  };

  const handleInsurance = (e, insuranceID) => {
    e.preventDefault();
    navigate(`/insurance/${insuranceID}`);
  };

  const handleSelect = (selectedKey) => {
    switch (selectedKey) {
      case "itinerary":
        navigate("/itinerary/create");
        break;
      case "flight":
        navigate("/flight/add");
        break;
      case "accomodation":
        navigate("/accomodation/add");
        break;
      case "rental":
        navigate("/rental/add");
        break;
      case "insurance":
        navigate("/insurance/add");
        break;
      default:
        console.log("No matching route");
    }
  };

  const handleUserID = (e) => setReceiverID(e.target.value);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/itinerary/invitation",
        { receiverID, itineraryID },
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setMessage(response.data);
        setTimeout(() => {
          setMessage("");
          setOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResponse = async (e, inviteID, status) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:8080/itinerary/invitation/response",
        { inviteID, status },
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleArchive = async (e, itineraryID) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.put(
        "http://localhost:8080/itinerary/archive",
        { itineraryID },
        {
          headers: {
            Authorization: `Bearer ${authTokenContext.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setRefresh(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home-container">
      <NavBar />
      <div className="banner">
        {url && <img src={url} className="img-banner" />}
        <div className="phrase-container">
          <span>Welcome back...</span>
          <span>{username}</span>
        </div>
      </div>
      <div className="content-container">
        {showPopup && invites && (
          <div className="invite-content">
            {invites.map((invite) => (
              <div className="invitation-popup" key={invite.id}>
                <button
                  className="close-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPopup(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="invitation-header">
                  <h3>Invitation</h3>
                </div>
                <div className="invitation-body">
                  <p>
                    <strong>{invite.sender.username}</strong> invited you to
                    join <strong>{invite.Itinerary.name}</strong>
                  </p>
                </div>
                <div className="response-container">
                  <button
                    className="accept-btn"
                    onClick={(e) => {
                      handleResponse(e, invite.id, "Accepted");
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={(e) => {
                      handleResponse(e, invite.id, "Declined");
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Box
          sx={{
            maxWidth: { xs: 425, sm: 425 },
            bgcolor: "grey.900",
            color: "common.white",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{
              "& .MuiTab-root": { color: "common.white" },
              "& .Mui-selected": { color: "primary.main" },
            }}
          >
            <Tab label="Itinerary" />
            <Tab label="Flight" />
            <Tab label="Accomodation" />
            <Tab label="Rental" />
            <Tab label="Insurance" />
            <Tab label="Expense" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <ul className="list">
              {itineraries &&
                itineraries.map((itinerary) => (
                  <li key={itinerary.id}>
                    <div
                      className="list-item"
                      onClick={(e) => handleItinerary(e, itinerary.id)}
                    >
                      <div className="itinerary-btn">
                        <h5>{itinerary.name}</h5>
                        <div className="action-container">
                          <span
                            className="archive-btn"
                            onClick={(e) => {
                              handleArchive(e, itinerary.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faArchive} />
                          </span>
                          {itinerary.isCreator && (
                            <span
                              className="invitation-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setItineraryID(itinerary.id);
                                setOpen(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faUserPlus} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
            <Popup open={open} onClose={() => setOpen(false)} modal>
              <button
                className="close-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <form className="invite-form" onSubmit={handleInvite}>
                <p>Enter UserID:</p>
                <input type="text" onChange={handleUserID}></input>
                <button type="submit" className="invite-btn">
                  Invite
                </button>
              </form>
              {message && <p className="flash-message">{message}</p>}
            </Popup>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ul className="list">
              {flights &&
                flights.map((flight) => (
                  <li key={flight.flightNumber}>
                    <button
                      className="list-btn"
                      onClick={(e) => handleFlight(e, flight.flightID)}
                    >
                      <div className="ticket-header">
                        <h4>Airline</h4>
                        <span className="flight-number">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <div className="ticket-body">
                        <h4>Departure</h4>
                        <p>
                          Airport: {flight.departure?.airport?.name || "N/A"}
                        </p>
                        <p>Terminal: {flight.departure?.terminal || "N/A"}</p>
                        <p>
                          Check-In Desk:{" "}
                          {flight.departure?.checkInDesk || "N/A"}
                        </p>
                        <p>Gate: {flight.departure?.gate || "N/A"}</p>
                        <p>
                          Scheduled Time:{" "}
                          {flight.departure?.scheduledTime?.local
                            ? format(
                                new Date(flight.departure.scheduledTime.local),
                                "EEE, MMM d, yyyy h:mm a"
                              )
                            : "N/A"}
                        </p>
                        <p>
                          Revised Time:{" "}
                          {flight.departure?.revisedTime?.local
                            ? format(
                                new Date(flight.departure.revisedTime.local),
                                "EEE, MMM d, yyyy h:mm a"
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ul className="list">
              {accomodations &&
                accomodations.map((accomodation) => (
                  <li key={accomodation.id}>
                    <button
                      className="list-btn"
                      onClick={(e) => handleAccomodation(e, accomodation.id)}
                    >
                      <div className="ticket-header">
                        <h4>{accomodation.name}</h4>
                      </div>
                      <div className="ticket-body">
                        <p>Location: {accomodation.location || "N/A"}</p>
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
                            ? format(
                                new Date(accomodation.end),
                                "EEE, MMM d, yyyy h:mm a"
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <ul className="list">
              {rentals &&
                rentals.map((rental) => (
                  <li key={rental.id}>
                    <button
                      className="list-btn"
                      onClick={(e) => handleRental(e, rental.id)}
                    >
                      <div className="ticket-header">
                        <h4>{rental.name}</h4>
                      </div>
                      <div className="ticket-body">
                        <p>Location: {rental.location || "N/A"}</p>
                        <p>
                          Start:{" "}
                          {rental.start
                            ? format(
                                new Date(rental.start),
                                "EEE, MMM d, yyyy h:mm a"
                              )
                            : "N/A"}
                        </p>
                        <p>
                          End:{" "}
                          {rental.end
                            ? format(
                                new Date(rental.end),
                                "EEE, MMM d, yyyy h:mm a"
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <ul className="list">
              {insurances &&
                insurances.map((insurance) => (
                  <li key={insurance.id}>
                    <button
                      className="list-btn"
                      onClick={(e) => handleInsurance(e, insurance.id)}
                    >
                      <div className="ticket-header">
                        <h4>{insurance.name}</h4>
                      </div>
                      <div className="ticket-body">
                        <p>
                          Start:{" "}
                          {insurance.start
                            ? format(
                                new Date(insurance.start),
                                "EEE, MMM d, yyyy h:mm a"
                              )
                            : "N/A"}
                        </p>
                        <p>
                          End:{" "}
                          {insurance.end
                            ? format(
                                new Date(insurance.end),
                                "EEE, MMM d, yyyy h:mm a"
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <div className="expense-container">
              <h4>Expenses Breakdown</h4>
              <p>Total: ${totalCost}</p>
              <PieChart width={600} height={450}>
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="center"
                  verticalAlign="bottom"
                />
                <Pie
                  data={pieChartData}
                  dataKey="cost"
                  nameKey="category"
                  outerRadius={150}
                  innerRadius={60}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={categoryColors[entry.category]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </TabPanel>
        </Box>
        <div className="add-container">
          <DropdownButton
            title={<FontAwesomeIcon icon={faPlus} />}
            id="dropdown-button-drop-up"
            drop="up"
            autoClose="outside"
            onSelect={handleSelect}
          >
            <Dropdown.Item eventKey="itinerary">Itinerary</Dropdown.Item>
            <Dropdown.Item eventKey="flight">Flight</Dropdown.Item>
            <Dropdown.Item eventKey="accomodation">Accomodation</Dropdown.Item>
            <Dropdown.Item eventKey="rental">Rental</Dropdown.Item>
            <Dropdown.Item eventKey="insurance">Insurance</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    </div>
  );
}

export default Home;
