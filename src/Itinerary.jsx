import "./Itinerary.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { format } from "date-fns";

import NavBar from "./components/NavBar";
import { AuthTokenContext } from "./App";
import TabPanel from "./components/TabPanel";

function Itinerary() {
  const authTokenContext = useContext(AuthTokenContext);

  const { itineraryID } = useParams();
  const navigate = useNavigate();

  const localizer = momentLocalizer(moment);

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [events, setEvents] = useState([]);
  const [types, setTypes] = useState([]);
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [value, setValue] = useState(0);

  const viewHeights = {
    month: "80vh",
    week: "200vh",
    day: "200vh",
  };
  const calendarHeight = viewHeights[currentView] || "80vh";

  const [pieChartData, setPieChartData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const categoryColors = {
    Food: "#FF0000",
    Attraction: "#0000FF",
    Entertainment: "#FFFF00",
    Transport: "#00FF00",
    Others: "#FFA500",
  };

  useEffect(() => {
    getItinerary();
  }, []);

  useEffect(() => {
    const costs = calculateCosts();
    setPieChartData(costs);
  }, [events]);

  const getItinerary = async () => {
    try {
      const response = await axios.get("http://localhost:8080/itinerary", {
        params: { itineraryID },
        headers: {
          Authorization: `Bearer ${authTokenContext.authToken}`,
        },
      });
      if (response) {
        setUrl(response.data.url);
        setName(response.data.name);
        const formattedEvents = response.data.events.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
        setTypes(response.data.types);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateCosts = () => {
    const totalCostByCategory = events.reduce((acc, event) => {
      const category =
        types.find((c) => c.id === event.ticketType)?.category || "Others";
      const cost = event.ticketCost ?? 0;

      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += cost;

      return acc;
    }, {});

    const total = Object.values(totalCostByCategory).reduce(
      (sum, cost) => sum + cost,
      0
    );
    setTotalCost(total);

    return [
      { category: "Food", cost: totalCostByCategory["Food"] || 0 },
      { category: "Attraction", cost: totalCostByCategory["Attraction"] || 0 },
      {
        category: "Entertainment",
        cost: totalCostByCategory["Entertainment"] || 0,
      },
      { category: "Transport", cost: totalCostByCategory["Transport"] || 0 },
      { category: "Others", cost: totalCostByCategory["Others"] || 0 },
    ];
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    navigate("event/add");
  };

  const handleAddTicket = (e, eventID) => {
    e.preventDefault();
    navigate(`/event/${eventID}/ticket/add`);
  };

  const eventComponent = ({ event }) => (
    <div className="event-component">
      <strong>{event.name}</strong> <br />
      <LocationLink address={event.location} />
      {event.ticketImage && (
        <p>
          Image:{" "}
          <a href={event.ticketImage} target="_blank" rel="noreferrer">
            {event.ticketImage}
          </a>
        </p>
      )}
    </div>
  );

  const LocationLink = ({ address }) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

    return (
      <p>
        Location:{" "}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          {address}
        </a>
      </p>
    );
  };

  const handleEdit = (e, eventID) => {
    e.preventDefault();
    navigate(`/event/${eventID}/edit`);
  };

  const handleDelete = async (e, eventID) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        "http://localhost:8080/event/delete",
        {
          params: { eventID },
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

  return (
    <div className="itinerary-container">
      <NavBar />
      <div className="banner">
        {url && <img src={url} className="img-banner" />}
        <div className="itinerary-phrase-container">
          <span>{name}</span>
        </div>
      </div>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
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
          <Tab label="Calendar" />
          <Tab label="Events" />
          <Tab label="Expenses" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={["day", "week", "month"]}
              view={currentView}
              onView={(view) => setCurrentView(view)}
              date={currentDate}
              onNavigate={handleNavigate}
              style={{ width: "100vw", height: calendarHeight }}
              components={{
                event: eventComponent,
              }}
            />
          </div>
          <button className="add-event-btn" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {events && (
            <div className="event-container">
              {events.map((event) => (
                <div className="event" key={event.id}>
                  <div className="event-date">
                    <h5>{format(event.start, "EEE, yyyy-MM-dd")}</h5>
                    <span>
                      <div className="btn-container">
                        <button
                          className="edit-btn"
                          onClick={(e) => {
                            handleEdit(e, event.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            handleDelete(e, event.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </span>
                  </div>
                  <div className="event-details">
                    <p>{event.name}</p>
                    <p>Start: {format(event.start, "HH:mm")}</p>
                    <p>End: {format(event.end, "HH:mm")}</p>
                    {event.location && (
                      <LocationLink address={event.location} />
                    )}
                    {event.ticketImage ? (
                      <p>
                        Image:{" "}
                        <a
                          href={event.ticketImage}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {event.ticketImage}
                        </a>
                      </p>
                    ) : (
                      <button
                        className="add-ticket-btn"
                        onClick={(e) => handleAddTicket(e, event.id)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className="expense-container">
            <h4>Expenses Breakdown</h4>
            <p>Total: ${totalCost}</p>
            <PieChart width={600} height={450}>
              <Tooltip />
              <Legend layout="vertical" align="center" verticalAlign="bottom" />
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
    </div>
  );
}

export default Itinerary;
