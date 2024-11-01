import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

//don't forget to change the class name into something what the page is supposed to be
//for example if you want to create a forum page change the name from 'Home' to 'Forum'
function Home() {
    // usestate for setting a javascript
    // object for storing and using data
    const [info, setInfo] = useState({
        name: "",
    });
    // Using useEffect for single rendering
    // console.log("phallus");
    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("/data").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                setInfo({
                    name: data.Name
                });
                console.log("kontol", data);
            })
        );
    }, []);


    const navigate = useNavigate();

    // Define the function to handle navigation
    const goToRegister = () => {
        console.log("tai");
        navigate('/register');
    };

    return (
        <div>
            <body>
                <Navbar />
                <div className="container" id="home">
                    <h1>{info.name}</h1>
                    <p>
                    Our stress management app is designed for San Francisco State University students and faculty, offering essential tools to combat stress: <br /><br />
            
                    <ul className="a">
                        <li>Chatbot Support: Get 24/7 personalized assistance and coping strategies.</li>
                        <li>Journal: Track your thoughts and emotions to enhance well-being.</li>
                        <li>Forum: Connect with peers for support and advice.</li>
                        <li>Resources: Access a library of articles and techniques on mindfulness and relaxation.</li>
                        <li>Task List: Stay organized and manage your responsibilities effectively.</li>
                    </ul>
            
                    <br />Join us in fostering a healthier academic environment! <br /><br />
                    </p>
                    {/* Link is basically the same thing as <a> in html so don't need to worry about it too much */}
                    {/* <button><Link to="/register">Register Now!</Link></button> */}
                    <button onClick={goToRegister}>Register Now!</button>
                </div>
            </body>
        </div>
    );
}

export default Home;


