import React, { useState, useEffect, useRef } from 'react';
import "./style.css";
import "./ChillMateLogo.png";
import { LoginContext } from "./LoginContext";

const suggestions = ["Find the resources in campus for you.📚", "Organizing your tasks for you.📋", "General conversation.😊"];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);  // Controls the visibility of the search bar
  const [showAnimatedText, setShowAnimatedText] = useState(true); // Controls the visibility of the animated text
  const [showBubbles, setShowBubbles] = useState(false); //Ensure `showBubbles` is declared with useState
  
  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);

  // AnimatedText Component
  const AnimatedText = () => {
    const [displayedText, setDisplayedText] = useState("");
    const fullText = "Heello! Choose one of the options below to get started.";


    useEffect(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullText.length - 1) {
          setDisplayedText((prev) => prev + fullText[index]);
          console.log(fullText[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 40); // Adjust speed as needed

      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return <div className="animated-text">{displayedText}</div>;
  };

  const getChatBot = async (message) => {
    console.log("message: ", message);
    try {
      const response = await fetch(`${process.env.REACT_APP_FLASK_URI}/chatbot/generate_goal_tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_text: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload post');
      }

      const data = await response.json();
      let resultString = `Goal: ${data.goal}\n\nSubtasks:\n`;
      data.subtasks.forEach((subtask, index) => {
        resultString += `Subtask ${index + 1}: ${subtask.subtask}\nImportance: ${subtask.importance}\nFocus: ${subtask.focus}\n`;
      });
      return resultString;
    } catch (error) {
      console.error('Error uploading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    const botReply = await getChatBot(input);
    setMessages([...messages, userMessage]);
    setInput('');

    const botResponse = botReply;
    if (loading) {
      console.log("waiting");
    }
    simulateTyping(botResponse);
  };

  const simulateTyping = (text) => {
    if (!text) {
      console.error("simulateTyping received undefined text.");
      return;
    }
  
    setTypingMessage('');
    let index = 0;
    const typingInterval = setInterval(() => {
      const currentChar = text.charAt(index);
  
      if (currentChar === '\n') {
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
  

  const handleSuggestionClick = (suggestion) => {
    setShowSearchBar(true);  // Show the search bar when a suggestion is clicked
    setShowAnimatedText(false); // Hide the animated text when a suggestion is clicked

    if (suggestion === "General conversation.😊") 
    {
      const specialMessage = { text: "Hello! How is your day?", sender: "bot", special: "general-conversation" };
    setMessages([...messages, specialMessage]);
    } 
    else
    {
    getChatBot(suggestion).then((botResponse) => {
      simulateTyping(botResponse); // Display the chatbot response in the chat
    });
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingMessage]);


  useEffect(() => {
    // Trigger bubbles only when the component mounts
    setShowBubbles(true);
  
    // Set a timer to hide the bubbles after 2 minutes
    const timer = setTimeout(() => {
      setShowBubbles(false); // Hide bubbles after the specified time
    }, 5000); // 2 minutes in milliseconds
  
    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount
  

//const bubbles = Array.from({ length: 80 }).map((_, index) => (
  //<div key={index} className="bubble"></div>
//));

  return (
    <div>
        <div className="chatbot-container">
         <h1>Chatbot</h1>
        {showAnimatedText && <AnimatedText />} {/* Only show AnimatedText if showAnimatedText is true */}
        <div className="chatbot-messages">
           {/* Add bubbles as the background */}
           {showBubbles && 
    Array.from({ length: 80 }).map((_, index) => (
      <div key={index} className="bubble"></div>
    ))
  }
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
          {typingMessage && <div className="message bot">{typingMessage}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Conditional rendering for search bar */}
        {showSearchBar && (
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
