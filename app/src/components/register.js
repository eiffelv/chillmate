import React from "react";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({
        sfsu_id: "",
        FirstName: "",
        LastName: "",
        Email:"",
        Password:"",
        Address:"",
        PhoneNum:"",
        Age:"",
        Occupation:"",
        Username:"",
        EmergencyContactEmail:"",
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip: ""
    });
    
    const [message, setMessage] = useState("");
    const [fullAddress, setAddress] = useState({
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip: "",
    })
    console.log("this user", user);
    console.log("this is full address", fullAddress);


    const handleSubmit = async (event) => {
        console.log("bangsat");
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_FLASK_URI}/register`, {
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


    // const { name, value } = e.target;

    // // Update fullAddress state if the field belongs to the address object
    // if (["line1", "line2", "city", "state", "zip"].includes(name)) {
    //     setAddress(prevAddress => ({ ...prevAddress, [name]: value }));
    // } else {
    //     // Update user state for other fields
    //     setUser(prevUser => ({ ...prevUser, [name]: value }));
    // }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value }); // Dynamically set the value based on field name
        // setAddress({ ...user, [name]: value }); 
        // setUser({Address: fullAddress});
    };

    const navigate = useNavigate();

    const goToLogin = () => {
        console.log("tai");
        navigate('/');
    };

    return (
        <body className="register">
            <Navbar />

            <div className="register-container">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    {/* Name Section */}
                    <div className="input-group">
                        <label>Name *</label>
                        <div className="name-container">
                            <input type="text" name="first_name" placeholder="First" value={user.FirstName} onChange={handleChange} required />
                            <input type="text" name="last_name" placeholder="Last" value={user.LastName} onChange={handleChange} required />
                        </div>
                    </div>
                    {/* Address Section */}
                    <div className="input-group">
                        <label>Address</label>
                        <input type="text" name="address_line_1" placeholder="Address Line 1" value={user.line1} onChange={handleChange} required />
                        <input type="text" name="address_line_2" placeholder="Address Line 2" value={user.line2} onChange={handleChange}/>
                    </div>
                    <div className="input-group">
                        <input type="text" name="city" placeholder="City" value={user.city} onChange={handleChange} required />
                        <div className="state-zip-container">
                            <select name="state" value={user.state} onChange={handleChange} required>
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
                            <input type="text" name="zip_code" placeholder="Zip Code" value={user.zip} onChange={handleChange} required />
                        </div>
                    </div>
                    {/* Other fields */}
                    <div className="input-group">
                        <input type="text" name="username" placeholder="Username" value={user.Username} onChange={handleChange}  required />
                        <input type="email" name="email" placeholder="Email" value={user.Email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={user.Password} onChange={handleChange}
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
                        value={user.PhoneNum} onChange={handleChange}
                        required
                        pattern="[0-9]{10}" // Optional: restrict to 10-digit phone numbers
                        title="Please enter a valid 10-digit phone number."
                    />
                    <input
                        type="number"
                        name="sfsu_id"
                        placeholder="SFSU ID"
                        value={user.sfsu_id} onChange={handleChange}
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

export default Register

// export default class Register extends React.Component {

//     render() {
        
//     }
// }


