import React, { useState } from "react";
import "./style.css";
import "./profile.css";

export default function Profile() {
    const [profile, setProfile] = useState({
        firstName: "Sneha",
        lastName: "Katturu",
        occupation: "Student",
        age: "",
        phoneNumber: "123-456-7890",
        address: "123 Market St, San Francisco",
        sfsuId: "12345678",
        sfsuEmail: "skatturu@sfsu.edu",
        password: "",
        confirmPassword: "",
        emergencyemail: "",

        emergencyContactNumber: "987-654-3210",

        relationship: "Parent"
    });

    const [editableFields, setEditableFields] = useState({
        firstName: false,
        lastName: false,
        sfsuEmail: false,
        sfsuId: false,
        age: false,
        address: false,
        occupation: false,
    });

    const [mood, setMood] = useState("neutral");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const toggleEditable = (field) => {
        setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const moodEmoji = {
        happy: "😊",
        neutral: "😐",
        sad: "😢",
    };

    const moodText = {
        happy: "Happy",
        neutral: "Neutral",
        sad: "Sad",
    };

    return (
        <div className="profile">
            <div className="profile-container">
                {/* Profile Content */}
                <div className="profile-content">

                    <h2>My Profile</h2>

                    <div className="profile-card">
                        <div className="profile-picture">
                            <div className="circle">
                                <span className="edit-icon">✎</span>
                            </div>
                            <div>
                                <h3>{profile.firstName} {profile.lastName}</h3>
                            </div>
                        </div>
                        <div className="profile-details">
                            <form className="profile-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name:</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profile.firstName}
                                            onChange={handleInputChange}
                                            onDoubleClick={() => toggleEditable('firstName')}
                                            readOnly={!editableFields.firstName}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name:</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleInputChange}
                                            onDoubleClick={() => toggleEditable('lastName')}
                                            readOnly={!editableFields.lastName}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>SFSU Email:</label>
                                        <input
                                            type="email"
                                            name="sfsuEmail"
                                            value={profile.sfsuEmail}
                                            onChange={handleInputChange}
                                            onDoubleClick={() => toggleEditable('sfsuEmail')}
                                            readOnly={!editableFields.sfsuEmail}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>SFSU ID:</label>
                                        <input
                                            type="text"
                                            name="sfsuId"
                                            value={profile.sfsuId}
                                            onChange={handleInputChange}
                                            onDoubleClick={() => toggleEditable('sfsuId')}
                                            readOnly={!editableFields.sfsuId}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Age:</label>
                                        <input
                                            type="text"
                                            name="age"
                                            value={profile.age}
                                            onChange={handleInputChange}
                                            onDoubleClick={() => toggleEditable('age')}
                                            readOnly={!editableFields.age}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Occupation:</label>
                                        <select
                                            name="occupation"
                                            value={profile.occupation}
                                            onChange={handleInputChange}
                                            onDoubleClick={() => toggleEditable('occupation')}
                                            disabled={!editableFields.occupation}
                                        >
                                            <option value="Faculty">Faculty</option>
                                            <option value="Student">Student</option>
                                            <option value="Professor">Professor</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Address:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={profile.address}
                                        onChange={handleInputChange}
                                        onDoubleClick={() => toggleEditable('address')}
                                        readOnly={!editableFields.address}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="mood-tracker-container">
                        <div className="mood-tracker">
                            <h3>Mood tracker</h3>
                            <div className="Current Mood">
                                Current Mood: {moodText[mood]}
                            </div>
                            <div className="emoji-tracker">
                                {moodEmoji[mood]}
                            </div>
                        </div>

                        <div className="emergency-contact-details">
                            <h4>Emergency Contact Details</h4>
                            <div className="form-group">
                                <label>Contact Number:</label>
                                <input
                                    type="text"
                                    name="contactnumber"
                                    value={profile.emergencyContactNumber}
                                    onChange={handleInputChange}
                                    onDoubleClick={() => toggleEditable('emergencyContactNumber')}
                                    readOnly={!editableFields.emergencyContactNumber}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={profile.emergencyemail}
                                    onChange={handleInputChange}
                                    onDoubleClick={() => toggleEditable('email')}
                                    readOnly={!editableFields.emergencyemail}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

