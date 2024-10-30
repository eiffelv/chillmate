import React, { useState } from 'react';

const AddJournalForm = ({ onAddEntry, onClose }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && date && content) {
      onAddEntry(title, date, content);
      // Reset fields after successful submission
      setTitle("");
      setDate("");
      setContent("");
    } else {
      alert("Please fill out all fields.");
    }
  };


  return (
    <div className="add-journal-form">
      <h2>New Journal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your journal..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddJournalForm;
