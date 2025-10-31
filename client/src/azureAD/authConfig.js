import { LogLevel } from "@azure/msal-browser";

const isLocalhost = window.location.hostname === "localhost";

const redirectUri = isLocalhost
  ? "http://localhost:3000/login"
  : "https://carbonfootprint-calculator.info";

const postLogoutRedirectUri = isLocalhost
  ? "http://localhost:3000"
  : "https://carbonfootprint-calculator.info/login";

export const msalConfig = {
  auth: {
    clientId: "f3b1c91b-f38e-4b4b-bbef-824a1dd02ce3",
    authority: "https://login.microsoftonline.com/common",
    redirectUri,
    postLogoutRedirectUri
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii) console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
};

export const loginRequest = {
  scopes: ["openid", "profile"]
};
