import React, { useState, useEffect, useRef } from "react";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./AdminDashboard.css";
import logo from "../images/uni_logo.png";
import { useNavigate } from "react-router-dom";

const hardcodedProfiles = [
  {
    name: "Default Profile",
    benchmarks: [
      ["Electricity Consumption", 123],
      ["Gas Consumption", 155],
      ["Water Consumption", 1.7],
    ],
  },
  {
    name: "Alternative Profile",
    benchmarks: [
      ["Electricity Consumption", 130],
      ["Gas Consumption", 160],
      ["Water Consumption", 1.5],
    ],
  },
  {
    name: "Alternative Profile 2",
    benchmarks: [
      ["Electricity Consumption", 140],
      ["Gas Consumption", 165],
      ["Water Consumption", 1.6],
    ],
  },
];

// Updated department data with green color palette
const departmentData = {
  labels: ["Engineering", "Business", "Science", "Law", "Medicine"],
  datasets: [
    {
      data: [40, 20, 15, 15, 10],
      backgroundColor: ["#7CC17C", "#98D18E", "#BFE3AF", "#8ACB88", "#5A9F5A"],
      borderWidth: 1,
      cutout: "60%",
    },
  ],
};

const AdminDashboard = () => {
  const [benchmarks, setBenchmarks] = useState(hardcodedProfiles[0].benchmarks);
  const [profiles, setProfiles] = useState(hardcodedProfiles);
  const [selectedProfile, setSelectedProfile] = useState(hardcodedProfiles[0].name);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const tableRef = useRef(null);
  const hotInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    renderTable(benchmarks);
  }, []);

  useEffect(() => {
    renderTable(benchmarks);
  }, [benchmarks]);

  const renderTable = (data) => {
    if (hotInstance.current) {
      hotInstance.current.destroy();
    }
    hotInstance.current = new Handsontable(tableRef.current, {
      data: JSON.parse(JSON.stringify(data)),
      colHeaders: ["Benchmark", "Value"],
      columns: [{ type: "text" }, { type: "numeric" }],
      stretchH: "all",
      width: "100%",
      height: "300px",
      licenseKey: "non-commercial-and-evaluation",
      minSpareRows: 0,
      contextMenu: ['row_above', 'row_below', 'remove_row'],
      allowEmpty: true,
      afterChange: (changes, source) => {
        if (source === 'edit') {
          // Just update benchmarks with current data
          // without filtering out rows with empty cells
          const currentData = hotInstance.current.getData();
          setBenchmarks(currentData);
        }
      }
    });
  };

  const handleProfileChange = (e) => {
    const profile = profiles.find((p) => p.name === e.target.value);
    setSelectedProfile(profile.name);
    setBenchmarks(profile.benchmarks);
  };

  const handleSaveProfile = () => {
    // Get the current data from the table
    const currentData = hotInstance.current.getData();

    // Filter out completely empty rows for validation
    const nonEmptyRows = currentData.filter(row =>
      row[0] || row[1] !== null && row[1] !== undefined && row[1] !== ""
    );

    // Check if any non-empty row has an empty field
    const hasPartiallyFilledRows = nonEmptyRows.some(row =>
      (!row[0] && (row[1] !== null && row[1] !== undefined && row[1] !== "")) ||
      (row[0] && (row[1] === null || row[1] === undefined || row[1] === ""))
    );

    if (hasPartiallyFilledRows) {
      setNotificationMessage("Error: All benchmark fields must be filled completely!");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    // Ensure there's at least one valid benchmark
    if (nonEmptyRows.length === 0) {
      setNotificationMessage("Error: At least one benchmark is required!");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    // Update the current profile with the edited benchmarks
    // Only keep rows where both fields are filled
    const validRows = nonEmptyRows.filter(row => row[0] && (row[1] !== null && row[1] !== undefined && row[1] !== ""));

    const updatedProfiles = profiles.map(profile => {
      if (profile.name === selectedProfile) {
        return {
          ...profile,
          benchmarks: validRows
        };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    setBenchmarks(validRows); // Update the visible benchmarks
    setNotificationMessage("Profile changes saved successfully!");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddNewProfile = () => {
    setShowNewProfileModal(true);
  };

  const handleCreateNewProfile = () => {
    // Validate profile name
    if (!newProfileName.trim()) {
      setNotificationMessage("Error: Profile name cannot be empty!");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    // Check if profile name already exists
    if (profiles.some(profile => profile.name === newProfileName)) {
      setNotificationMessage("Error: Profile name already exists!");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    const newProfile = {
      name: newProfileName,
      benchmarks: [["", ""]]
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setSelectedProfile(newProfileName);
    setBenchmarks(newProfile.benchmarks);

    // Reset and close modal
    setNewProfileName("");
    setShowNewProfileModal(false);

    setNotificationMessage("New profile created successfully! Add benchmarks and save when done.");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddBenchmarkRow = () => {
    const currentData = hotInstance.current.getData();
    const updatedData = [...currentData, ["", ""]];
    setBenchmarks(updatedData);
  };

  return (
    <div className="main-content">
      {showNotification && (
        <div className="overlay">
          <div className="notification-box">
            <p>{notificationMessage}</p>
          </div>
        </div>
      )}

      {showNewProfileModal && (
        <div className="overlay">
          <div className="modal-box">
            <h3>Create New Profile</h3>
            <div className="form-row">
              <label>Profile Name:</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="form-input full-width"
              />
            </div>
            <div className="modal-actions">
              <button
                className="action-btn compact"
                onClick={handleCreateNewProfile}
              >
                Create
              </button>
              <button
                className="action-btn compact secondary"
                onClick={() => setShowNewProfileModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="toolbar">
        <div className="toolbar-logo">
          <img className="logo" src={logo} alt="University Logo" />
        </div>
        <div className="nav-links">
          <button className="action-btn" onClick={() => navigate('/admin/users')}>Manage Users</button>
          <button className="action-btn" onClick={() => navigate('/admin/entries')}>Manage Entries</button>
          <button className="action-btn" onClick={() => navigate('/admin/settings')}>Settings</button>
          <button className="action-btn" onClick={() => navigate('/logout')}>Logout</button>
        </div>
      </div>
      <div className="scrolling-content">
        <div className="hero-section">
          <h2 className="hero-title">
            Admin Dashboard
          </h2>
          <p className="hero-description">
            Manage university administration system.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* SECTION 1: Benchmark Controls */}
          <div className="dashboard-panel">
            <h3 className="panel-header">
              Benchmark Management
            </h3>
            <div className="panel-content">
              <div className="control-row">
                <select
                  className="dropdown-select"
                  onChange={handleProfileChange}
                  value={selectedProfile}
                >
                  {profiles.map((profile) => (
                    <option key={profile.name} value={profile.name}>
                      {profile.name}
                    </option>
                  ))}
                </select>
                <button
                  className="action-btn compact"
                  onClick={handleSaveProfile}
                >
                  Save Profile
                </button>
              </div>
              <div className="control-row">
                <button
                  className="action-btn compact"
                  onClick={handleAddNewProfile}
                >
                  New Profile
                </button>
                <button
                  className="action-btn compact"
                  onClick={handleAddBenchmarkRow}
                >
                  Add Benchmark
                </button>
              </div>
              <div ref={tableRef} id="benchmark-table"></div>
            </div>
          </div>

          {/* SECTION 2: Carbon Calculator */}
          <div className="dashboard-panel">
            <h3 className="panel-header">
              Carbon Calculator
            </h3>
            <div className="panel-content">
              {/* Content for Carbon Calculator will go here */}
            </div>
          </div>

          {/* SECTION 3: Donut Chart */}
          <div className="dashboard-panel">
            <h3 className="panel-header">
              Department Distribution
            </h3>
            <div className="panel-content">
              <div className="chart-container">
                <Doughnut
                  data={departmentData}
                  options={{
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          boxWidth: 10,
                          padding: 6,
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;