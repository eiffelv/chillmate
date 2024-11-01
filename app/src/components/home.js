import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";

//don't forget to change the class name into something what the page is supposed to be
//for example if you want to create a forum page change the name from 'Home' to 'Forum'
export default class Home extends React.Component {

    // example
    // put all the html code from the previous index to the return function
    // there will be some error since some html code does not fit React, so i recommend go to
    // chatgpt/ any ai to ask to change it to fit react code
    //also i think everything needs to be put in a div to work? i don't really know but just to make sure
    //put it in a div even if the div doesn't do anything
    render() {
      return (
        <div>
            <body>
                <Navbar />
                <div className="container" id="home">
                    <h1>ChillMate</h1>
                    <p className="homeDescription">
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
                    <button><Link to="/register">Register Now!</Link></button>
                </div>
            </body>
        </div>
      );
    }
}


