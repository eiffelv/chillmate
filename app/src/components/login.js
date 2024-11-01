import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


function Login() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const [message, setMessage] = useState("");
    console.log(user);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value }); // Dynamically set the value based on field name
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        console.log("bangsat");
        event.preventDefault();

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                goToProfile()
            } else {
                alert("user/password is wrong");
            }
        } catch (error) {
            setMessage("An error occurred while registering.");
        }
    };

    const goToProfile = () => {
        console.log("tai");
        navigate('/');
    };


    return (
        <body className="login">
            <Navbar />
            <div className="login-container">
                <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="username" value={user.username} placeholder="Username" required onChange={handleChange}/>
                        <input type="password" name="password" value={user.password} placeholder="Password" required onChange={handleChange}/>
                        <button type="submit"><a href="index.html">Login</a></button>
                    </form>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>

        </body>
      );

}

export default Login;




