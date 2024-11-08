import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import "./style.css";
import "./ChillMateLogo.png";
import Navbar from "./navbar";

function Login() {
    const { login } = useContext(LoginContext);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    console.log(user);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_FLASK_URI}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
                credentials: "include"
            });

            const data = await response.json();
            if (data.message === 'User logged in successfully') {
                login();  // Update login state
                navigate('/');
            } else {
                alert("Username/password is incorrect");
            }
        } catch (error) {
            setMessage("An error occurred while logging in.");
        }
    };

    return (
        <div className="login">
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
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
}

export default Login;
