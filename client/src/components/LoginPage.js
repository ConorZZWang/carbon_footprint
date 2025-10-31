import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AuthForm.css';
import backgroundImage from '../images/login_signup.jpg';
import logo from '../images/logo.png';
import uniLogo from '../images/uni_logo.png';
import SignInButton from '../azureAD/SignInButton';

function LoginPage() {
  const location = useLocation();
  // Retrieve the error message from the location state, if any.
  const errorMessage = location.state?.error || '';

  return (
    <div className="auth-container">
      <div
        className="auth-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="left-overlay">
        <a href="https://www.gla.ac.uk/" target="_blank" rel="noopener noreferrer">
          <img src={uniLogo} alt="University Logo" className="form-uniLogo" />
        </a>
        <Link to="/">
          <img src={logo} alt="Logo" className="form-logo" />
        </Link>
        <div className="auth-form">
          <h2>Welcome!</h2>
          <p>For academic users only:</p>
          {errorMessage && (
            <p className="error-message" style={{ color: 'red' }}>
              {errorMessage}
            </p>
          )}
          <SignInButton />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
