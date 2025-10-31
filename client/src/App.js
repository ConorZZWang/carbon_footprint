import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useMsal, MsalBroadcastService } from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import MainContent from "./components/MainContent";
import LoginPage from "./components/LoginPage";

import './App.css';
import MaintainerDashboard from './components/MaintainerDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const { accounts, instance } = useMsal();

  // Capture login
  useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
//	console.log("LOGIN_SUCCESS event:", event.payload.account);
        instance.setActiveAccount(event.payload.account);
//	console.log("Active account after event:", instance.getActiveAccount());
      }
    });
    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  const isAuthenticated = accounts && accounts.length > 0;
//  console.log("MSAL accounts:", accounts);

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={isAuthenticated ? <MainContent /> : <Navigate replace to="/login" />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate replace to="/" /> : <LoginPage />}
        />

        <Route path="/maintainer" element={<MaintainerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}


export default App;
