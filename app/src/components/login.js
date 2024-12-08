import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
// import FormEnabler
import FormEnabler from "./FormEnabler";
import "./style.css";
import "./ChillMateLogo.png";
import FlowerPic from "./lavender.jpg";

function Login() {
  const { login } = useContext(LoginContext);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  console.log(user);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Enable Input and Button fields
  const enableFields = () => {
    // use FormEnabler to enable fields
    FormEnabler.toggleEnable();
  };

  // Disable Input and Button fields
  const disableFields = () => {
    // use FormEnabler to disable fields
    FormEnabler.toggleDisable();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Disable input fields and button while waiting for response
      disableFields();
      setMessage("Please Wait, Trying to Login...");

      // Send POST request to login endpoint
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await response.json();

      // Re-enable input fields and button after response
      enableFields();

      if (data.message === "Invalid username or password") {
        setMessage("Username/Password is incorrect");
      } else if (data.accessToken !== null) {
        login(); // Update login state
        //store data token
        localStorage.setItem("accessToken", data.access_token);
        setMessage("Login successful!");
        // Redirect to profile page after a brief delay
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
      enableFields();
    }
  };

  return (
    <login className="login">
      <img src={FlowerPic} alt="LoginPic" className="login-image" />
      <div className="login-container">
        <h2>Login</h2>

        {message && <p className="error-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </login>
  );
}

export default Login;
