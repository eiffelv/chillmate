import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import "./ChillMateLogo.png";
import { LoginContext } from "./LoginContext";
import JournalList from "./journalList";
import AddJournalForm from "./addjournalForm";
import HTMLFlipBook from "react-pageflip";

const JournalPage = () => {
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
        console.log("response: ", data);

        //format the journal entry from database array
        const formattedJournal = data.map((post) => ({
          //ask kevin about this
          //id: post._id,
          title: post.Title || "",
          content: post.Content || "",
          color: post.color || "#FFFFFF"
        }));
        //put journal entry to website
        setEntries(formattedJournal);
      } catch (error) {
        console.error("Error uploading post:", error);
        // Handle error, e.g., display an error message to the user
      }
    };
    getJournal();
  }, [showAddForm]);
  

  //upload new journal entry to database
  const uploadJournal = async (newEntry) => {
    const token = localStorage.getItem("accessToken");

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
    } catch (error) {
      console.error("Error uploading post:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  // Filtered entries based on search query
  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to add a new journal entry
  const addJournalEntry = (title, content, color) => {
    //i got rid of id = dateID from newEntry so we'll have to discuss this later
    const newEntry = { title, content, color };
    uploadJournal(newEntry);
    setEntries((prevEntries) => [newEntry, ...prevEntries]);
    setShowAddForm(false); // Hide form after submission
  };

  // Pagination Logic
  const indexOfLastJournal = currentPage * journalsPerPage;
  const indexOfFirstJournal = indexOfLastJournal - journalsPerPage;
  const currentJournals = filteredEntries.slice(indexOfFirstJournal, indexOfLastJournal);
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
          <JournalList entries={currentJournals} />
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
