import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import "./ChillMateLogo.png";
import { LoginContext } from "./LoginContext";
import JournalList from "./journalList";
import AddJournalForm from "./addjournalForm";

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
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
  const addJournalEntry = (title, date, content, color) => {
    //i got rid of id = dateID from newEntry so we'll have to discuss this later
    const newEntry = { title, date, content, color };
    console.log(newEntry);
    uploadJournal(newEntry);
    setEntries((prevEntries) => [...prevEntries, newEntry]);
    console.log("keupload ga ?");
    setShowAddForm(false); // Hide form after submission
  };

  return (
    <div className="journal">
      <div className="journal-page">
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

        <JournalList
          entries={filteredEntries}
          latestEntryRef={latestEntryRef}
        />
        {showAddForm && (
          <div ref={formRef}>
            <AddJournalForm
              onAddEntry={addJournalEntry}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
