//import React from "react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png";
import Chatbot from "./Chatbot.png";
import Forum from "./Forum.png";
import Journal from "./Journal.png";
import Resources from "./Resources.png";
import Tasklist from "./TaskList.png";

function Home() {
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

    return () => observer.disconnect(); // Cleanup observer
  }, []);

  return (
    <div className="containerHome" id="home">
      <h1>ChillMate</h1>
      <div classname="Title">
        <h5 className="fade-in">
          <em>Empowering You on Your Mental Health Journey</em>
        </h5>
        <p>Discover a Path to Better Mental Health with ChillMate</p>
        <button className="pulse-button" onClick={goToAbout}>
          Learn more ➜
        </button>
      </div>
      <p></p>
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
      <p>Join us in fostering a healthier academic environment!</p>
      <button className="pulse-button" onClick={goToRegister}>
        Register Now!
      </button>
    </div>
  );
}

export default Home;
