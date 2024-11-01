import React, { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";



const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref to track the end of messages for scrolling

  // Function to handle sending a new message
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    // Start typing animation for bot response
    const botResponse = `You said: ${input}`;
    simulateTyping(botResponse);
  };

  // Function to simulate typing animation
  const simulateTyping = (text) => {
    setTypingMessage('');
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypingMessage((prevText) => prevText + text.charAt(index));
      index++;

      if (index === text.length) {
        clearInterval(typingInterval);
        setMessages((prevMessages) => [...prevMessages, { text, sender: 'bot' }]);
        setTypingMessage('');
      }
    }, 50);
  };

  // Function to handle Enter key submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // Effect to scroll to the bottom of messages when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingMessage]);

  return (
    <div>
      <body>
      <Navbar />
      <div className="chatbot-container">
        <h1>Chatbot</h1>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {/* Show typing message for bot */}
          {typingMessage && <div className="message bot">{typingMessage}</div>}
          <div ref={messagesEndRef} /> {/* Element to scroll to */}
        </div>
        <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      </div>
      
      </body>
    </div>
    
  );
};

export default Chatbot;

