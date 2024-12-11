/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "./ChillMateLogo.png";
import { LoginContext } from "./LoginContext";
import { logoutUser } from "./Logout";
import JournalList from "./journalList";
import AddJournalForm from "./addjournalForm";
import HTMLFlipBook from "react-pageflip";
import { ReactPageFlip } from "react-pageflip";

const JournalPage = () => {
  const { isLoggedIn, logout } = useContext(LoginContext); // Get login state and logout function
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [flipDirection, setFlipDirection] = useState(null);
  const journalsPerPage = 2;
  const latestEntryRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (showAddForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
    getJournal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddForm]);

  //get journal entries from database
  const getJournal = async (e) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/journal/getJournal`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          //body: JSON.stringify(newJournal),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }
      const data = await response.json();
      // console.log("response: ", data);

      //format the journal entry from database array
      const formattedJournal = data.map((post) => ({
        //ask kevin about this
        //id: post._id,
        title: post.Title || "<No Title>",
        content: post.Content || "<No Content>",
        // Convert timestamp to date string
        date: convertTimestampToDate(post.Timestamp) || "<No Date>",
        timestamp: post.Timestamp,
        color: post.Color || "#FFFFFF",
      }));
      //put journal entry to website
      setEntries(formattedJournal);
    } catch (error) {
      // console.error("Error uploading post:", error);
      // Handle error, e.g., display an error message to the user
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toDateString();
  };

  const convertDateToLosAngeles = (date) => {
    // Add 12 hours to the date to convert to Los Angeles time
    const losAngelesDate = new Date(date);
    losAngelesDate.setHours(losAngelesDate.getHours() + 12);
    return losAngelesDate;
  };

  //upload new journal entry to database
  const uploadJournal = async (newEntry) => {
    const token = localStorage.getItem("accessToken");

    newEntry.date = Math.floor(
      Date.parse(convertDateToLosAngeles(newEntry.date)) / 1000
    );

    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/journal/createJournal`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newEntry),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }

      const data = await response.json();
      console.log(data);
      // Handle success or error based on the response data
      getJournal();
    } catch (error) {
      // console.error("Error uploading post:", error);
      // Handle error, e.g., display an error message to the user
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };

  // Filtered entries based on search query
  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to add a new journal entry
  const addJournalEntry = (title, date, content, color) => {
    const newEntry = { title, date, content, color };
    uploadJournal(newEntry);
    setEntries((prevEntries) => [newEntry, ...prevEntries]);
    setShowAddForm(false); // Hide form after submission
  };

  const handleDelete = async (title, timestamp, content) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/journal/deleteJournal`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, timestamp, content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete journal");
      }

      // Remove entry from state
      setEntries(
        entries.filter(
          (entry) =>
            entry.title !== title &&
            entry.timestamp !== timestamp &&
            entry.content !== content
        )
      );
    } catch (error) {
      console.error("Error deleting journal:", error);
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };

  // Pagination Logic
  const indexOfLastJournal = currentPage * journalsPerPage;
  const indexOfFirstJournal = indexOfLastJournal - journalsPerPage;
  const currentJournals = filteredEntries.slice(
    indexOfFirstJournal,
    indexOfLastJournal
  );
  const totalPages = Math.ceil(filteredEntries.length / journalsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setFlipDirection("forward"); // Set the direction to forward
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setFlipDirection("backward"); // Set the direction to backward
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="journal">
      <h1>Journal</h1>
      <input
        type="text"
        placeholder="Search journal..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="add-journal-button"
        onClick={() => setShowAddForm(true)}
      >
        +
      </button>

      <div className="journal-flip-container">
        <div
          className="journal-entries"
          style={{
            transform:
              flipDirection === "forward"
                ? "rotateY(-360deg)"
                : flipDirection === "backward"
                ? "rotateY(360deg)"
                : "rotateY(0deg)",
            transition: "transform 1s ease",
          }}
        >
          <JournalList entries={currentJournals} onDelete={handleDelete} />
        </div>
      </div>

      {showAddForm && (
        <div ref={formRef}>
          <AddJournalForm
            onAddEntry={addJournalEntry}
            onClose={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          ← Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default JournalPage;
