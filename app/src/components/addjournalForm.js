import React, { useState } from 'react';

const AddJournalForm = ({ onAddEntry, onClose }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#FFFFFF");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && date && content) {
      onAddEntry(title, date, content, color);
      // Reset fields after successful submission
      setTitle("");
      setDate("");
      setContent("");
    } else {
      alert("Please fill out all fields.");
    }
  };

  const colors = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFECB3", "#D1C4E9", "#B3E5FC", "#FFF9C4"];

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
        <div className="color-picker">
          <p>Choose a color for your journal:</p>
          <div className="color-options">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                style={{
                  backgroundColor: c,
                  border: color === c ? '2px solid #000' : '1px solid #ddd',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddJournalForm;
