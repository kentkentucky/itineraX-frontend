import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_DOMAIN}
      clientId={import.meta.env.VITE_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUDIENCE,
        scope:
          "read:current_user update:current_user_metadata openid profile email read:message update:user",
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
