import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./style.css";
import "./ChillMateLogo.png"
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
            const response = await fetch(`${process.env.REACT_APP_FLASK_URI}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            console.log(data)
            if (data.message === 'User registered successfully') {
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
            <nav>
                <ul>
                    <li>
                        <Link to = "/">
                            <img src={require('./ChillMateLogo.png')} alt="Logo" width="50" height="50" />
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="login-container">
                <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" name="username" value={user.username} onChange={handleChange} required />
                        <input type="password" placeholder="Password" name="password"value={user.password} onChange={handleChange} required />
                        <button type="submit"><a href="index.html">Login</a></button>
                    </form>
                <p>Don't have an account? <Link to = "/register">Register here</Link></p>
            </div>

            <script src="scripts.js"></script>
        </body>
    );
}

export default Login


// export default class Login extends React.Component {




//     render() {

//     }
// }
