import React, { useEffect } from 'react';
import './MainContent.css';
import TextBox from './TextBox.js';

import { scrollToEntry } from './scripts.js';
import ExportPDF from "./ExportPDF"; // Ensure the correct path

import overheadtress from '../images/overheadtress.jpg';
import greenforest from '../images/lightBulb.jpg';
import mountainriver from '../images/tubes.jpeg';
import mistyforest from '../images/microscope.jpg';
import rockyriver from '../images/rockyriver.jpg';
import denseoverhead from '../images/two_people.webp';
import upwardtress from '../images/mistyforest.jpg';
import logo from '../images/uni_logo.png';
import { useNavigate } from 'react-router-dom';

import Results from './calculatorComponents/Results';
import AreaForm from './calculatorComponents/AreaForm';
import TransportForm from './calculatorComponents/TransportForm';
import WasteForm from './calculatorComponents/WasteForm';
import ProcurementForm from './calculatorComponents/ProcurementForm';
import ProcurementGraph from './calculatorComponents/ProcurementGraph';
import ResultsGraph from './calculatorComponents/ResultsGraph';
import ProcurementTable from './calculatorComponents/ProcurementTable';
import TransportTable from './calculatorComponents/TransportTable';
import WasteTable from './calculatorComponents/WasteTable';
import StaffForm from './calculatorComponents/StaffForm';
import ExportDatabase from './calculatorComponents/ExportDatabase';
import { CalculatorProvider } from '../context/CalculatorContext';
import Graph from './graph';

import { useMsal } from '@azure/msal-react';


const Toolbar = () => {
  const { accounts, instance } = useMsal();
  const navigate = useNavigate();

  const isAuthenticated = accounts && accounts.length > 0;

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-logo">
        <img className="logo" src={logo} alt="logo" />
      </div>
      <div className="toolbar-links">
        {isAuthenticated ? (
          <button className="beginButton" onClick={handleLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <CalculatorProvider>
      <div className="main-content">
        <Toolbar />
        <div className="scrolling-content">
          {/* Hero Section */}
          <div className="heroSection">
            <h1 className="heroTitle">
              Analyse. <br />
              Discover your impact.<br />
            </h1>
            <p className="heroDescription">
              <center>
                Track your impact with precision. <br />
                By inputting data across categories like fuel, food, space, and heating, <br />
                our platform calculates your CO₂ emissions and lets you compare with other institution's research facilities, <br />
                empowering you to make informed, sustainable choices. <br /><br />
                <button className="beginButton" onClick={scrollToEntry} id="beginButton">Begin</button>
              </center>
            </p>
            <div className="ImageMural">
              <center>
                <img className="overheadtress" src={overheadtress} alt="1" />
                <img className="greenforest" src={greenforest} alt="2" />
                <img className="mountainriver" src={mountainriver} alt="3" />
                <img className="mistyforest" src={mistyforest} alt="4" />
                <img className="rockyriver" src={rockyriver} alt="5" />
                <img className="denseoverhead" src={denseoverhead} alt="6" />
                <img className="upwardtress" src={upwardtress} alt="7" />
              </center>
            </div>

          </div>

          {/* Main Dashboard */}
          <div className='background'></div>
          <center>
            <div>
              <h1>Download PDF Example</h1>
              <ExportPDF />
            </div>
            <div className="dashboard-card" id='top'>
              <div className="container-left">
                <h3 className="container-header">Resource Allocation & Facility Data </h3>
                <StaffForm />
                <AreaForm />
                {/*<div className="graphContainer">*/}
                {/* <div className="Graphs">*/}
                {/*<h3>15.02.2025</h3>*/}
                {/*<Graph /> {/* Replacing hardcoded Pie chart with Graph component */}
                {/*</div>*/}
                {/*</div>*/}
              </div>

              {/* New Entry Section */}
              <div className="container-middle">
                <h3 className="container-header">New Project</h3>
                <TextBox title="Project" id="project" />
                <TextBox title="Date" id="date" />
                <h3 className="container-header">Procurement Entries</h3>
                <ProcurementForm />
                <div className="input-card">
                  <ProcurementTable />
                </div>
              </div>

              {/* Discovery Section */}
              <div className="container-right">
                <h3 className="container-header">Activity Log</h3>
                <TransportForm />
                <TransportTable />
                <WasteForm />
                <WasteTable />
              </div>
            </div>
          </center>

          <div className='background'></div>
          <center>
            <div className="dashboard-card" id='bottom'>
              {/* Procurement Section */}
              <div className="container middle">
                <h3 className="container-header">Procurement Graph</h3>
                <ProcurementGraph />
              </div>
              <div className="container-middle">
                <h3 className="container-middle-header">Carbon Emission Results</h3>
                <Results />
                <ResultsGraph />
                <div className="factorContainer" id="factorContainer"></div>
                <div className="factorContainer" id="factorContainer"></div>

              </div>
            </div>
          </center>

          {/* University Results */}
          {/*<div className="graphContainer">*/}
          {/*<div className="Graphs">*/}
          {/*<h3>University of Bath Results</h3>*/}
          {/*<Graph /> {/* Using Graph component again */}
          {/* </div>*/}
          {/*</div>*/}
        </div>
      </div >
    </CalculatorProvider >
  );
};

export default MainContent;
