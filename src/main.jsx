import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./services/msalConfig";

const startApp = async () => {
  const msalInstance = new PublicClientApplication(msalConfig);

  // Initialize MSAL if Client ID is configured
  if (msalConfig.auth.clientId) {
    try {
      await msalInstance.initialize();
    } catch (e) {
      console.error("MSAL initialization failed:", e);
    }
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );
};

startApp();
