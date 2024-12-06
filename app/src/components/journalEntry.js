// JournalEntry.js
import React from "react";

const JournalEntry = ({ entry }) => (
  <div className="journal-entry">
    <h2>{entry.title}</h2>
    <p>{entry.content}</p>
  </div>
);

export default JournalEntry;
