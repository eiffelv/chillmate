import React, { useEffect, useState } from "react";
import "./style.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "Sneha Katturu",
    firstName: "Sneha",
    lastName: "Katturu",
    occupation: "Student",
    age: "24",
    phoneNumber: "123-456-7890",
    address1: "123 Market St, San Francisco",
    address2: "Market St",
    state: "California",
    city: "San Francisco",
    sfsuId: "12345678",
    sfsuEmail: "skatturu@sfsu.edu",
    EmergencycontactfirstName: "Anjali",
    EmergencycontactlastName: "Chiruvandhulu",
    emergencyContactNumber: "987-654-3210",
    emergencyemail: "parent@gmail.com",
    relationship: "Mother",
    mood: "neutral",
  });

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

  const [mood, setMood] = useState("neutral");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const getProfileData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing! User might be logged out.");
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/auth/getProfile`,
        {
          method: "GET", // Use GET method
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          mode: "cors",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching profile:", errorData);
        return;
      }
  
      const user = await response.json();
      console.log("Fetched profile:", user);
  

      setProfile({
        username: user.Username || "Default Username",
        firstName: user.FirstName || "Default First Name",
        lastName: user.LastName || "Default Last Name",
        occupation: user.Occupation || "Unknown",
        age: user.Age || "Unknown",
        phoneNumber: user.PhoneNum || "Unknown",
        address1: user.Address || "No Address",
        address2: user.Address || "No Address",
        state: user.State || "Unknown",
        city: user.City || "Unknown",
        sfsuId: user.SFStateID || "No ID",
        sfsuEmail: user.Email || "No Email",
        EmergencycontactfirstName: user.emerEmergencyContactFirstName || "Default First Name",
        EmergencycontactlastName: user.EmergencyContactLastName || "Default Last Name",
        emergencyContactNumber: user.EmergencyContactNumber || "Unknown",
        emergencyemail: user.EmergencyContactEmail || "No Email",
        relationship: user.EmergencyContactRelationship || "Unknown", 
        mood: "neutral", 
      });
    } catch (error) {}
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleMoodChange = (newMood) => {
    setEditedProfile({ ...editedProfile, mood: newMood });
  };

  const changeMood = (newMood) => {
    setMood(newMood);
  };

  //function that call api to get profile data
  useEffect(() => {
    console.log("getting profile");
    getProfileData();
  }, []);

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="strip"></div>
        /* Edit/Save Button 
        <div className="button-container">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEditClick}>
              Edit
            </button>
          ) : (
            <button className="save-button" onClick={handleSaveClick}>
              Save
            </button>
          )}
        </div>

        {/* Mood Tracker */}
        <div className="mood-tracker-container">
          <div className="emoji-tracker">
            {isEditing ? (
              <div className="mood-selector">
                <button onClick={() => handleMoodChange("happy")}>😊</button>
                <button onClick={() => handleMoodChange("neutral")}>😐</button>
                <button onClick={() => handleMoodChange("sad")}>😢</button>
              </div>
            ) : (
              <span>{moodEmoji[profile.mood]}</span>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-header">
          <h3>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={editedProfile.username}
                onChange={handleInputChange}
              />
            ) : (
              profile.username
            )}{" "}
          </h3>
        </div>

        <div className="profile-details-heading">
          <h4>Profile Details</h4>
        </div>

        <div className="profile-details">
          <div className="row">
            <p>
              <strong>First Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedProfile.firstName}
                  onChange={handleInputChange}
                />
              ) : (
                profile.firstName
              )}
            </p>
            <p>
              <strong>Last Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedProfile.lastName}
                  onChange={handleInputChange}
                />
              ) : (
                profile.lastName
              )}
            </p>
          </div>

          <div className="row">
            <p>
              <strong>Address:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="address1"
                  value={editedProfile.address1}
                  onChange={handleInputChange}
                />
              ) : (
                profile.address1
              )}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedProfile.phoneNumber}
                  onChange={handleInputChange}
                />
              ) : (
                profile.phoneNumber
              )}
            </p>
          </div>

          <div className="row">
            <p>
              <strong>State:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={editedProfile.state}
                  onChange={handleInputChange}
                />
              ) : (
                profile.state
              )}
            </p>
            <p>
              <strong>City:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={editedProfile.city}
                  onChange={handleInputChange}
                />
              ) : (
                profile.city
              )}
            </p>
          </div>

          <div className="row">
            <p>
              <strong>SFSU Email:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={editedProfile.sfsuEmail}
                  onChange={handleInputChange}
                />
              ) : (
                profile.sfsuEmail
              )}
            </p>
            <p>
              <strong>SFSU ID:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={editedProfile.sfsuId}
                  onChange={handleInputChange}
                />
              ) : (
                profile.sfsuId
              )}
            </p>
          </div>
        </div>

        <div className="emergency-details-heading">
          <h4>Emergency Details</h4>
        </div>

        <div className="emergency-details">
          <div className="row">
            <p>
              <strong>First Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="EmergencycontactfirstName"
                  value={editedProfile.EmergencycontactfirstName}
                  onChange={handleInputChange}
                />
              ) : (
                profile.EmergencycontactfirstName
              )}
            </p>
            <p>
              <strong>Last Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="EmergencycontactlastName"
                  value={editedProfile.EmergencycontactlastName}
                  onChange={handleInputChange}
                />
              ) : (
                profile.EmergencycontactlastName
              )}
            </p>
          </div>

          <div className="row">
            <p>
              <strong>Contact:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContactNumber"
                  value={editedProfile.emergencyContactNumber}
                  onChange={handleInputChange}
                />
              ) : (
                profile.emergencyContactNumber
              )}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyemail"
                  value={editedProfile.emergencyemail}
                  onChange={handleInputChange}
                />
              ) : (
                profile.emergencyemail
              )}
            </p>
          </div>

          <div className="row">
            <p>
              <strong>Relationship:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="relationship"
                  value={editedProfile.relationship}
                  onChange={handleInputChange}
                />
              ) : (
                profile.relationship
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
