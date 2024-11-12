import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import "./style.css";
import "./ChillMateLogo.png";

function Login() {
    const { login } = useContext(LoginContext);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    // console.log(user);
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
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            if (data.message === 'Invalid username or password') {
                setMessage("Username/Password is incorrect");
            } else if (data.accessToken !== null) {
                login();  // Update login state
                //store data token
                localStorage.setItem('accessToken', data.access_token);
                setMessage("Login successful!");
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again later.");
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
