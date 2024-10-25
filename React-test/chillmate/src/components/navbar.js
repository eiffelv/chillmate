import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png";
import home from "./home";
import Login from "./login";
import Forum from "./forum";
// import About from "./about";
// import Resources from "./resources";
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {

    render() {
      return (
        <div>
          <body>
            <nav className="navbar">
              <ul>
                <li>
                  <Link to="/home">
                  <img src={require('./ChillMateLogo.png')} alt="Logo" width="50" height="50" />
                  </Link>
                </li> 
                <li>
                     {/* Link is basically the same thing as <a> in html so don't need to worry about it too much */}
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/forum">Forum</Link>
                </li>
                <li>
                    {/* <Link to=" /about">About</Link>
                    <a href={'about'}></a> */}
                </li>
                <li>
                    {/* <Link to=" /resources">Resources</Link>
                    <a href={'resources'}></a> */}
                </li>
              </ul>
            </nav>
          </body>
        </div>
      );
    }
}


