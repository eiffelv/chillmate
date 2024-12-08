//import React from "react";
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "./ChillMateLogo.png";
import Chatbot from "./Chatbot.png";
import Forum from "./Forum.png";
import Journal from "./Journal.png";
import Resources from "./Resources.png";
import Tasklist from "./TaskList.png";
import { logoutUser } from "./Logout";
import { LoginContext } from "./LoginContext";

function Home() {
  const { isLoggedIn, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  // Define the function to handle navigation
  const goToRegister = () => {
    console.log("Navigating to register");
    navigate("/register");
  };

  const goToAbout = () => {
    console.log("Navigating to about");
    navigate("/about");
  };

  const checkLogin = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing! User might be logged out.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/auth/getProfile`,
        {
          method: "GET", // Use GET method
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get profile");
      }
    } catch (error) {
      console.error("Logging Out, Invalid Token");
      // Handle error, e.g., display an error message to the user
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };

  // Add the scroll animation logic
  useEffect(() => {
    const features = document.querySelectorAll(".feature");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    features.forEach((feature) => observer.observe(feature));

    checkLogin();

    return () => observer.disconnect(); // Cleanup observer
  }, []);

  return (
    <div className="containerHome" id="home">
      <h1>ChillMate</h1>
      <div className="Title">
        <h5 className="fade-in">
          <em>Empowering You on Your Mental Health Journey</em>
        </h5>
        <p>Discover a Path to Better Mental Health with ChillMate</p>
        <br />
        <br />
        <button className="pulse-button" onClick={goToAbout}>
          Learn more ➜
        </button>
      </div>
      <br />
      <br />
      <div className="missionStatement">
        <h2>Our Mission</h2>
        <h3>
          We <em>empower</em> you with the knowledge and skills you need to
          strengthen your mental health & well-being
        </h3>
      </div>
      <div className="features">
        <div className="feature">
          <h4>Chatbot Support</h4>
          <p>Get 24/7 personalized assistance and coping strategies.</p>
          <img src={Chatbot} width="100" height="100" alt="Chatbot" />
        </div>
        <div className="feature">
          <h4>Journal</h4>
          <p>Track your thoughts and emotions to enhance well-being.</p>
          <img src={Journal} width="100" height="100" alt="Journal" />
        </div>
        <div className="feature">
          <h4>Forum</h4>
          <p>Connect with peers for support and advice.</p>
          <img src={Forum} width="100" height="100" alt="Forum" />
        </div>
        <div className="feature">
          <h4>Resources</h4>
          <p>
            Access a library of articles and techniques on mindfulness and
            relaxation.
          </p>
          <img src={Resources} width="100" height="100" alt="Resources" />
        </div>
        <div className="feature">
          <h4>Task List</h4>
          <p>Stay organized and manage your responsibilities effectively.</p>
          <img src={Tasklist} width="100" height="100" alt="TaskList" />
        </div>
      </div>
      <br />
      <br />
      <p>Join us in fostering a healthier academic environment!</p>
      <br />
      <button className="pulse-button" onClick={goToRegister}>
        Register Now!
      </button>
    </div>
  );
}

export default Home;
