import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import "./ChillMateLogo.png"
import { LoginContext } from "./LoginContext";
import Navbar from "./navbar";
import JournalList from './journalList';
import AddJournalForm from './addjournalForm';


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

        const getJournal = async (e) => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await fetch(`${process.env.REACT_APP_FLASK_URI}/getJournal`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                    },
                    //body: JSON.stringify(newJournal),
                });
            
                if (!response.ok) {
                    throw new Error('Failed to upload post');
                }
                const data = await response.json();
                console.log("response: ", data);

                const formattedPosts = data.map(post => ({
                    topic: post.Topic || "Untitled",
                    content: post.Text || "",
                    liked: false
                  }));


            } catch (error) {
            console.error('Error uploading post:', error);
            // Handle error, e.g., display an error message to the user
            };

        };
        getJournal();


    }, [showAddForm]);

    // Filtered entries based on search query
    const filteredEntries = entries.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to add a new journal entry
    const addJournalEntry = (title, date, content, color) => {
        const newEntry = { id: Date.now(), title, date, content, color };
        setEntries((prevEntries) => [...prevEntries, newEntry]);
        setShowAddForm(false);  // Hide form after submission
    };


    return (
        <div className="journal">
            <div className="journal-page">
                <h2>Journal</h2>
                <input
                    type="text"
                    placeholder="Search journal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="add-journal-button"
                    onClick={() => setShowAddForm(true)}>+</button>

                <JournalList entries={filteredEntries} latestEntryRef={latestEntryRef} />
                {showAddForm && (
                    <div ref={formRef}>
                        <AddJournalForm
                            onAddEntry={addJournalEntry}
                            onClose={() => setShowAddForm(false)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalPage;