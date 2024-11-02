import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import "./ChillMateLogo.png";

function Login() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
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
            });

            const data = await response.json();
            if (data.message === 'User registered successfully') {
                goToProfile();
            } else {
                alert("User/password is wrong");
            }
        } catch (error) {
            setMessage("An error occurred while logging in.");
        }
    };

    const goToProfile = () => {
        navigate('/');
    };

    return (
        <div className="login">
            <nav>
                <ul>
                    <li>
                        <Link to="/">
                            <img src={require('./ChillMateLogo.png')} alt="Logo" width="50" height="50" />
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="login-container">
                <h2>Login</h2>
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
