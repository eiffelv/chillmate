// JournalList.js
import React from "react";

const JournalList = ({ entries }) => (
  <div className="journal-list">
    {entries.map((entry) => (
      <div
        key={entry.id}
        className="journal-entry"
        style={{ backgroundColor: entry.color }}
      >
        <h3>{entry.title}</h3>
        <p>{entry.content}</p>
      </div>
    ))}
  </div>
);

export default JournalList;
