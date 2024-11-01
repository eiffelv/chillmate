import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// export default class Register extends React.Component {

//     render() {
//       return (
//         <div className="register">
//                 <nav>
//                     <ul>
//                     <li>
//                         <a href="home.html">
//                         <img src={require('./ChillMateLogo.png')} alt="Logo" width="50" height="50" />
//                         </a>
//                     </li>
//                     </ul>
//                 </nav>

//         <div className="register-container">
//             <h2>Register</h2>
//             <form action="register.php" method="POST">
//             <input type="text" name="username" placeholder="Username" required />
//             <input type="email" name="email" placeholder="Email" required />
//             <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="Password"
//                 required   
//             />
//             <span id="passwordError" className="error">
//                 Password must be at least 8 characters long and contain at least one uppercase letter.
//             </span>
//             <input
//                 type="password"
//                 id="confirm_password"
//                 name="confirm_password"
//                 placeholder="Confirm Password"
//                 required
//             />
//             <span id="confirmPasswordError" className="error">
//                 Passwords do not match.
//             </span>
//             <input
//                 type="number"
//                 name="SFSU id"
//                 placeholder="SFSU ID"
//                 required
//             />
//             <button type="submit"><a href="login.html">Create Account</a></button>
//             </form>
//             <p>
//                 Already have an account? <a href="login.html">Login here</a>
//             </p>
//         </div>
//         </div>
//       );
//     }
// }


//don't forget to change the class name into something what the page is supposed to be
//for example if you want to create a forum page change the name from 'Home' to 'Forum'
function Register() {
    // usestate for setting a javascript
    // object for storing and using data
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        sid: ""
    });
    const [message, setMessage] = useState("");

    console.log(user);


    const handleSubmit = async (event) => {
        console.log("bangsat");
        event.preventDefault();
        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.error || "An error occurred");
            }
        } catch (error) {
            setMessage("An error occurred while registering.");
        }
        goToLogin()
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value }); // Dynamically set the value based on field name
    };

    const navigate = useNavigate();

    const goToLogin = () => {
        console.log("tai");
        navigate('/');
    };
    

    return (
        <div className="register">
                <nav>
                    <ul>
                    <li>
                        <a href="home.html">
                        <img src={require('./ChillMateLogo.png')} alt="Logo" width="50" height="50" />
                        </a>
                    </li>
                    </ul>
                </nav>

        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
            <input 
                type="text" name="username" placeholder="Username" required 
                value={user.username}
                onChange={handleChange}
            />
            <input 
                type="email" name="email" placeholder="Email" required
                value={user.email}
                onChange={handleChange}
             />
            <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required  
                value={user.password}
                onChange={handleChange}
            />
            <span id="passwordError" className="error">
                Password must be at least 8 characters long and contain at least one uppercase letter.
            </span>
            <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirm Password"
                required
            />
            <span id="confirmPasswordError" className="error">
                Passwords do not match.
            </span>
            <input
                type="text"
                name="sid"
                placeholder="SFSU ID"
                required
                value={user.sid}
                onChange={handleChange}
            />
            <button type="submit">Create Account</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
        </div>
    );
}

export default Register;


