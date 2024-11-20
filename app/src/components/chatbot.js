import React, { useState, useEffect, useRef } from 'react';
import "./style.css";
import "./ChillMateLogo.png"
import { LoginContext } from "./LoginContext";


const suggestions = ["Find the resources in campus for you.📚", "Organizing your tasks for you.📋", "Gernal conversation.😊"];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref to track the end of messages for scrolling

  const [loading, setLoading] = useState(true);

  //getting chatbot response find resources
  const getResources = async (message) => {
    console.log("message: ", message);
    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_URI}/chatbot/find_sim_docs`, {
        method: "POST",
        // credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_text: message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload post');
      }
  
      const data = await response.json();

      let resourceString ='';

      data.forEach((resources, index) => {
        resourceString += `
        ${index + 1}: ${resources.Resource_title}
        ${resources.Resource_link}
        ${resources.Resource_body}
            `;
      });

      return resourceString;


    } catch (error) {
      console.error('Error uploading post:', error);
      // Handle error, e.g., display an error message to the user
    }
    finally {
      setLoading(false); // Once the promise settles, update loading state
    }
  }



  //getting chatbot to do list response
  const getChatBot = async (message) => {
    console.log("message: ", message);
    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_URI}/chatbot/generate_goal_tasks`, {
        method: "POST",
        // credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_text: message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload post');
      }
  
      const data = await response.json();
      
      //Convert the object to a single string
      let resultString = `Goal: ${data.goal}\n\nSubtasks:\n`;

      data.subtasks.forEach((subtask, index) => {
          resultString += `
      Subtask ${index + 1}: ${subtask.subtask}
      Importance: ${subtask.importance}
      Focus: ${subtask.focus}
          `;
      });


      return resultString;
      // Handle success or error based on the response data
    } catch (error) {
      console.error('Error uploading post:', error);
      // Handle error, e.g., display an error message to the user
    }
    finally {
      setLoading(false); // Once the promise settles, update loading state
    }
  }


  // Function to handle sending a new message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };

    const botReply = await getResources(input);



    setMessages([...messages, userMessage]);
    setInput('');

    // Start typing animation for bot response
    console.log("botReply: ", botReply);
    const botResponse = botReply;
    console.log("showing: ", botResponse)
    if(loading) {
      console.log("waiting")
    }
    simulateTyping(botResponse);
  };

  // Function to simulate typing animation
  const simulateTyping = (text) => {
    setTypingMessage('');
    let index = 0;
    const typingInterval = setInterval(() => {
      const currentChar = text.charAt(index);
    
      if (currentChar === '\n') {
          console.log("space pls");
          setTypingMessage((prevText) => prevText + '\n');
      } else {
          setTypingMessage((prevText) => prevText + currentChar);
      }
      index++;

      if (index === text.length) {
        clearInterval(typingInterval);
        setMessages((prevMessages) => [...prevMessages, { text, sender: 'bot' }]);
        setTypingMessage('');
      }
    }, 10);
  };

  // Handle click on a suggested question
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
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
      <div className="chatbot-container">
        <h1>Chatbot</h1>
        <div className="chatbot-messages">
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <button key={index} className="suggestion-button" onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
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

    </div>

  );
};

export default Chatbot;