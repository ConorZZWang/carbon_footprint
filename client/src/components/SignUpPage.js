import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';
import backgroundImage from '../images/login_signup.jpg';
import logo from '../images/logo.png';
import uniLogo from '../images/uni_logo.png';

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [institution, setInstitution] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Combine first and last names to form a username
    const username = `${firstName} ${lastName}`;

    try {
      const response = await axios.post('http://localhost:8080/signup', {
        email,
        username,
        password
      });
      setMessage(response.data.message || 'Signup successful!');
      // Redirect or further processing here if needed
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || error.response.data.message);
      } else {
        setMessage('Error signing up');
      }
    }
  };

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
          <form onSubmit={handleSignUp}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="inline-fields">
              <input
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <label htmlFor="institution" className="form-label">Type in your Institution Name:</label>
            <input type="text" id="institution" placeholder="Institution Name" required />
            <button type="submit" className="button submit">Join Us</button>
            <p className="text-link">
              Already a member? <Link to="/login">Sign in</Link>
            </p>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
