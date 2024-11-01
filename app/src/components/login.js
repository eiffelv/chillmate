import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./style.css";
import "./ChillMateLogo.png"

export default class Login extends React.Component {

    render() {
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
                    <form>
                        <input type="text" placeholder="Username" name="username" required />
                        <input type="password" placeholder="Password" name="password" required />
                        <button type="submit"><a href="index.html">Login</a></button>
                    </form>
                <p>Don't have an account? <Link to = "/register">Register here</Link></p>
            </div>

            <script src="scripts.js"></script>
        </body>
      );
    }
}
