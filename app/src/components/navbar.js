import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "./ChillMate.svg";
import "./style.css";
import { LoginContext } from "./LoginContext"; // Import the LoginContext

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(LoginContext); // Get login state and logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_FLASK_URI}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    logout(); // Update login state
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">
              <Logo width="50" height="50" />
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="/forum">Forum</Link>
            ) : (
              <Link to="/login">Forum</Link>
            )}
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="/chatbot">Chatbot</Link>
            ) : (
              <Link to="/login">Chatbot</Link>
            )}
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="/journal">Journal</Link>
            ) : (
              <Link to="/login">Journal</Link>
            )}
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/resources">Resources</Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="/profile">Profile</Link>
            ) : (
              <Link to="/login">Profile</Link>
            )}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            ) : (
              /*Link is basically the same thing as <a> in html so don't need to worry about it too much*/
              <Link to="/login" className="login-button">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
