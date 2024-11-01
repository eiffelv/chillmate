import React from "react";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";

export default class Register extends React.Component {

    render() {
        return (

            <body className="register">
                <Navbar />

                <div className="register-container">
                    <h2>Register</h2>
                    <form action="register.php" method="POST" className="register-form">
                        {/* Name Section */}
                        <div className="input-group">
                            <label>Name *</label>
                            <div className="name-container">
                                <input type="text" name="first_name" placeholder="First" required />
                                <input type="text" name="last_name" placeholder="Last" required />
                            </div>
                        </div>
                        {/* Address Section */}
                        <div className="input-group">
                            <label>Address</label>
                            <input type="text" name="address_line_1" placeholder="Address Line 1" required />
                            <input type="text" name="address_line_2" placeholder="Address Line 2" />
                        </div>
                        <div className="input-group">
                            <input type="text" name="city" placeholder="City" required />
                            <div className="state-zip-container">
                                <select name="state" required>
                                    <option value="" disabled selected>Select State</option>
                                    <option value="Alabama">Alabama</option>
                                    <option value="Alaska">Alaska</option>
                                    <option value="Arizona">Arizona</option>
                                    <option value="Arkansas">Arkansas</option>
                                    <option value="California">California</option>
                                    <option value="Colorado">Colorado</option>
                                    <option value="Connecticut">Connecticut</option>
                                    <option value="Delaware">Delaware</option>
                                    <option value="Florida">Florida</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Hawaii">Hawaii</option>
                                    <option value="Idaho">Idaho</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Indiana">Indiana</option>
                                    <option value="Iowa">Iowa</option>
                                    <option value="Kansas">Kansas</option>
                                    <option value="Kentucky">Kentucky</option>
                                    <option value="Louisiana">Louisiana</option>
                                    <option value="Maine">Maine</option>
                                    <option value="Maryland">Maryland</option>
                                    <option value="Massachusetts">Massachusetts</option>
                                    <option value="Michigan">Michigan</option>
                                    <option value="Minnesota">Minnesota</option>
                                    <option value="Mississippi">Mississippi</option>
                                    <option value="Missouri">Missouri</option>
                                    <option value="Montana">Montana</option>
                                    <option value="Nebraska">Nebraska</option>
                                    <option value="Nevada">Nevada</option>
                                    <option value="New Hampshire">New Hampshire</option>
                                    <option value="New Jersey">New Jersey</option>
                                    <option value="New Mexico">New Mexico</option>
                                    <option value="New York">New York</option>
                                    <option value="North Carolina">North Carolina</option>
                                    <option value="North Dakota">North Dakota</option>
                                    <option value="Ohio">Ohio</option>
                                    <option value="Oklahoma">Oklahoma</option>
                                    <option value="Oregon">Oregon</option>
                                    <option value="Pennsylvania">Pennsylvania</option>
                                    <option value="Rhode Island">Rhode Island</option>
                                    <option value="South Carolina">South Carolina</option>
                                    <option value="South Dakota">South Dakota</option>
                                    <option value="Tennessee">Tennessee</option>
                                    <option value="Texas">Texas</option>
                                    <option value="Utah">Utah</option>
                                    <option value="Vermont">Vermont</option>
                                    <option value="Virginia">Virginia</option>
                                    <option value="Washington">Washington</option>
                                    <option value="West Virginia">West Virginia</option>
                                    <option value="Wisconsin">Wisconsin</option>
                                    <option value="Wyoming">Wyoming</option>
                                </select>
                            </div>
                            <input type="text" name="zip_code" placeholder="Zip Code" required />
                        </div>
                        {/* Other fields */}
                        <div className="input-group">
                            <input type="text" name="username" placeholder="Username" required />
                            <input type="email" name="email" placeholder="Email" required />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="Confirm Password"
                                required
                            />
                        </div>
                        <input
                            type="tel"
                            name="phone_number"
                            placeholder="Phone Number"
                            required
                            pattern="[0-9]{10}" // Optional: restrict to 10-digit phone numbers
                            title="Please enter a valid 10-digit phone number."
                        />
                        <input
                            type="number"
                            name="sfsu_id"
                            placeholder="SFSU ID"
                            required
                        />
                        <button type="submit">Create Account</button>
                    </form>
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </body >
        );
    }
}


