import React, { useState } from "react";


const AddJournalForm = ({ onAddEntry, onClose }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#FFFFFF");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && content) {
      onAddEntry(title, date, content, color);
      // Reset fields after successful submission
      setTitle("");
      setDate("");
      // console.log(date);
      setContent("");
      setColor("#FFFFFF");
    } else {
      alert("Please fill out all fields.");
    }
  };

  const colors = [
    "#FFFFFF",
    "#FFCDD2",
    "#C8E6C9",
    "#BBDEFB",
    "#FFECB3",
    "#D1C4E9",
    "#B3E5FC",
    "#FFF9C4",
  ];

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
                  border: color === c ? "2px solid #000" : "1px solid #ddd",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <p>
          </p>
        <button
          type="submit"
          style={{
            backgroundColor: "#e069f8", // Green background
            color: "white",             // White text
            border: "black",             // No border
            padding: "10px 20px",       // Padding
            fontSize: "16px",           // Font size
            cursor: "pointer",          // Pointer cursor on hover
            borderRadius: "5px",        // Rounded corners
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
            transition: "background-color 0.3s ease",  // Transition effect
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#c300ff"} // Darker green on hover
          onMouseLeave={(e) => e.target.style.backgroundColor = "#e069f8"} // Reset color on mouse leave
        >
          Save
        </button>

        <button  
          type="button" 
          onClick={onClose}
          style={{
            backgroundColor: "#e069f8", // Green background
            color: "white",             // White text
            border: "black",             // No border
            padding: "10px 20px",       // Padding
            fontSize: "16px",           // Font size
            cursor: "pointer",          // Pointer cursor on hover
            borderRadius: "5px",        // Rounded corners
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
            transition: "background-color 0.3s ease",  // Transition effect
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#c300ff"} // Darker green on hover
          onMouseLeave={(e) => e.target.style.backgroundColor = "#e069f8"} // Reset color on mouse leave
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddJournalForm;
