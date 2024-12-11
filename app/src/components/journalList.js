// JournalList.js
import React from "react";
import "./style.css";

const JournalList = ({ entries, onDelete }) => (
  <div className="journal-list">
    {entries.map((entry) => (
      <div
        key={entry.id}
        className="journal-entry"
        style={{ backgroundColor: entry.color }}
      >
        <h3>{entry.title}</h3>
        <h6>{entry.date}</h6>
        <p>{entry.content}</p>
        <button
          className="delete-journal-button"
          onClick={() => onDelete(entry.title, entry.timestamp, entry.content)}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
);

export default JournalList;
