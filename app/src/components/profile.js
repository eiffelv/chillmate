import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext"; // Import the LoginContext
import { logoutUser } from "./Logout";
import "./style.css";

export default function Profile() {
  const { isLoggedIn, logout } = useContext(LoginContext); // Get login state and logout function
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "⌛",
    firstName: "⌛",
    lastName: "⌛",
    occupation: "⌛",
    age: "⌛",
    phoneNumber: "⌛",
    address1: "1600 Holloway Ave",
    address2: "⌛",
    state: "California",
    city: "San Francisco",
    sfsuId: "⌛",
    sfsuEmail: "⌛",
    EmergencycontactfirstName: "⌛",
    EmergencycontactlastName: "⌛",
    emergencyContactNumber: "⌛",
    emergencyemail: "⌛",
    relationship: "⌛",
    mood: "loading",
  });

  const moodEmoji = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    angry: "😡",
    excited: "😆",
    calm: "😌",
    anxious: "😢",
    loading: "⌛",
  };

  const moodText = {
    happy: "Happy",
    neutral: "Neutral",
    sad: "Sad",
    angry: "Angry",
    excited: "Excited",
    calm: "Calm",
    anxious: "Anxious",
    loading: "Loading",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const getProfileData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // console.error("Access token is missing! User might be logged out.");
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
        // const data = await response.json();
        // console.log(data);
        throw new Error("Failed to get profile");
      }
      const user = await response.json();
      // console.log("Fetched profile:", user);

      setProfile({
        username: user.Username || "(empty)",
        firstName: user.FirstName || "(empty)",
        lastName: user.LastName || "(empty)",
        occupation: user.Occupation || "(empty)",
        age: user.Age || "(empty)",
        phoneNumber: user.PhoneNum || "(empty)",
        address1: user.Address || "(empty)",
        address2: user.Address2 || "(empty)",
        state: user.State || "(empty)",
        city: user.City || "(empty)",
        sfsuId: user.SFStateID || "(empty)",
        sfsuEmail: user.Email || "(empty)",
        EmergencycontactfirstName: user.EmergencyContactFirstName || "(empty)",
        EmergencycontactlastName: user.EmergencyContactLastName || "(empty)",
        emergencyContactNumber: user.EmergencyContactNum || "(empty)",
        emergencyemail: user.EmergencyContactEmail || "(empty)",
        relationship: user.EmergencyContactRelationship || "(empty)",
        mood: user.Mood || "(empty)",
      });
    } catch (error) {
      // console.error("Error getting profile:", error);
      // Handle error, e.g., display an error message to the user
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };
  const handleEditClick = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setProfile(editedProfile);
    updateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const updateMood = async () => {
    const token = localStorage.getItem("accessToken");
    setProfile({ ...profile, mood: "loading" });
    document.querySelector(".update-button").disabled = true;
    try {
      // disable button className "update-button" while waiting for response

      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/chatbot/mood_tracker`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update mood");
      }

      const data = await response.json();
      // console.log(data);
      setProfile({ ...profile, mood: data.mood });
      sendMood(data.mood);
    } catch (error) {
      // console.error("Error updating mood:", error);
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
    document.querySelector(".update-button").disabled = false;
  };

  const sendMood = async (newMood) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/auth/updateMood`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mood: newMood }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update mood");
      }

      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      // console.error("Error updating mood:", error);
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };

  const updateProfile = async (editedProfile) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/auth/updateProfile`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      //const data = await response.json();
      //console.log(data);
    } catch (error) {
      // console.error("Error updating profile:", error);
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };

  const textMood = () => {
    const output =
      "Current Mood: " + moodText[profile.mood] + " -- Click to Update Mood";
    return output;
  };

  //function that call api to get profile data on page load
  useEffect(() => {
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="strip"></div>
        <div className="button-container">
          <button className="update-button" onClick={() => updateMood()}>
            Update Mood
          </button>
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
            {/* Make emoji clickable link to update mood */}

            <span
              className="clickable"
              title={textMood()}
              onClick={() => updateMood()}
            >
              {moodEmoji[profile.mood]}
            </span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-header">
          <h3>{profile.username} </h3>
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
                  disabled
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
