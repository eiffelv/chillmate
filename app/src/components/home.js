import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png";
import Navbar from "./navbar";
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    // Define the function to handle navigation
    const goToRegister = () => {
        console.log("Navigating to register");
        navigate('/register');
    };

    return (
        <div>
            <Navbar />
            <div className="container" id="home">
                <h1>ChillMate</h1>
                <div className="homeDescription">
                    <p>Our stress management app is designed for San Francisco State University students and faculty, offering essential tools to combat stress:</p>
                    <ul className="a">
                        <li>Chatbot Support: Get 24/7 personalized assistance and coping strategies.</li>
                        <li>Journal: Track your thoughts and emotions to enhance well-being.</li>
                        <li>Forum: Connect with peers for support and advice.</li>
                        <li>Resources: Access a library of articles and techniques on mindfulness and relaxation.</li>
                        <li>Task List: Stay organized and manage your responsibilities effectively.</li>
                    </ul>
                    <p>Join us in fostering a healthier academic environment!</p>
                </div>
                <button onClick={goToRegister}>Register Now!</button>
            </div>
        </div>
    );
}

export default Home;
