import "./NavBar.css";

import { useNavigate } from "react-router";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";

function NavBar() {
  const { logout } = useAuth0();

  const navigate = useNavigate();

  return (
    <div className="navbar-container">
      <button
        className="home-btn"
        onClick={() => {
          navigate("/home");
        }}
      >
        itineraX
      </button>
      <DropdownButton
        title={<FontAwesomeIcon icon={faUser} />}
        id="dropdown-basic-button"
        autoClose="outside"
      >
        <Dropdown.Item
          onClick={() => {
            navigate("/profile");
          }}
        >
          Edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            navigate("/archive");
          }}
        >
          Archives
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <button
            className="logout-btn"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
}

export default NavBar;
