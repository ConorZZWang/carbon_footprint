import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  return (
    <button onClick={handleLogin} className="button submit">
      Sign in with University Account
    </button>
  );
};

export default SignInButton;
