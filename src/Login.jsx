import "./Login.css";

import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";

import { AuthTokenContext } from "./App";

function Login() {
  const authTokenContext = useContext(AuthTokenContext);

  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getAuthToken();
    }
  }, [isAuthenticated]);

  const getAuthToken = async () => {
    try {
      const authToken = await getAccessTokenSilently();
      if (authToken) {
        authTokenContext.setAuthToken(authToken);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h1>itineraX</h1>
      {isAuthenticated ? null : (
        <button className="login-btn" onClick={() => loginWithRedirect()}>
          Login
        </button>
      )}
    </div>
  );
}

export default Login;
