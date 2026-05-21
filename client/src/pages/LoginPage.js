// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ onLoginSuccess }) {

  // -----------------------------
  // React State Variables
  // -----------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // -------------------------------------------------------
  // 🔥 BACKEND: Replace with your backend's auth URL
  // Example for local dev: "http://localhost:5000/api/auth"
  // -------------------------------------------------------
  const API_BASE = "http://localhost:5000/api/auth";

  // -------------------------------------------------------
  // 🚀 Handles both Login and Signup (Connects to Backend)
  // -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear old error messages

    try {
      if (isSignup) {
        // -----------------------------------
        // 🔥 SIGNUP SECTION (Backend Call)
        // -----------------------------------

        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }

        const response = await axios.post(`${API_BASE}/signup`, {
          username,  // Send to backend
          email,
          password
        });

        // If signup fails (email exists, etc.)
        if (!response.data.success) {
          setError(response.data.message); // Show "email exists" message
          return;
        }

        // Save user session
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", response.data.username);

        onLoginSuccess();

        // ------------------------------------------------
        // 🔥 Redirect to HomePage (link your homepage here)
        // ------------------------------------------------
        navigate("/");

      } else {
        // -----------------------------------
        // 🔥 LOGIN SECTION (Backend Call)
        // -----------------------------------
        const response = await axios.post(`${API_BASE}/login`, {
          email,
          password
        });

        if (!response.data.success) {
          setError(response.data.message || "Invalid login credentials");
          return;
        }

        // Save session
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", response.data.username);

        onLoginSuccess();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">

        {/* Dynamic Title */}
        <h2>{isSignup ? "Create Your Account" : "Welcome to Cozy Kitchen"}</h2>

        {/* Display Error */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit}>

          {/* EMAIL FIELD */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@gmail.com"
              required
            />
          </div>

          {/* 🔥 USERNAME FIELD (Only for Sign Up) */}
          {isSignup && (
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your username"
                required
              />
            </div>
          )}

          {/* PASSWORD FIELD */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* 🔥 CONFIRM PASSWORD (Only for Sign Up) */}
          {isSignup && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button type="submit" className="login-button">
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "600" }}
                onClick={() => setIsSignup(false)}
              >
                Sign In
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "600" }}
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </span>
            </>
          )}
        </p>

      </div>
    </div>
  );
}

export default LoginPage;
