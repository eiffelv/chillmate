// JournalList.js
import React from "react";
import JournalEntry from "./journalEntry";

const JournalList = ({ entries }) => (
  <div className="journal-list">
    {entries.map((entry) => (
      <div
        key={entry.id}
        className="journal-entry"
        style={{ backgroundColor: entry.color }}
      >
        <h3>{entry.title}</h3>
        <p>{entry.date}</p>
        <p>{entry.content}</p>
      </div>
    ))}
  </div>
);

export default JournalList;
