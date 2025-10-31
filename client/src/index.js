import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./azureAD/authConfig";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MsalProvider } from "@azure/msal-react";

const msalInstance = new PublicClientApplication(msalConfig);

(async () => {
  await msalInstance.initialize();
  try {
    const response = await msalInstance.handleRedirectPromise();
    if (response && response.account) {
      msalInstance.setActiveAccount(response.account);
      console.log("Redirect processed, active account set:", response.account);
    }
  } catch (error) {
    console.error("Redirect error:", error);
  }
  const container = document.getElementById("root");
  const root = ReactDOM.createRoot(container);
  root.render(
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
})();
