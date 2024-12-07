import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "./ChillMateLogo.png";
import { LoginContext } from "./LoginContext";

/*
const suggestions = [
  "Find the resources in campus for you.📚",
  "Organizing your tasks for you.📋",
  "General conversation.😊",
];
*/

const suggestions = [
  { text: "Find the resources in campus for you.📚", id: "cb1" },
  { text: "Organizing your tasks for you.📋", id: "cb2" },
  { text: "General conversation.😊", id: "cb3" },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false); // Controls the visibility of the search bar
  const [showAnimatedText, setShowAnimatedText] = useState(true); // Controls the visibility of the animated text
  const [showBubbles, setShowBubbles] = useState(false); //Ensure `showBubbles` is declared with useState
  const [currentId, setCurrentId] = useState("");

  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(""); // State to track the selected ID

  // State to store conversation history for each suggestion
  const [conversationHistory, setConversationHistory] = useState({
    cb1: [],
    cb2: [],
    cb3: [],
  });

  const renderMessageWithLinks = (text) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g; // Regex to detect URLs
    const parts = text.split(linkRegex); // Split the text by links

    return parts.map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {part}
          </a>
        );
      }
      return part; // Render non-link text as-is
    });
  };

  // AnimatedText Component
  const AnimatedText = () => {
    const [displayedText, setDisplayedText] = useState("");
    const fullText = "Heello! Choose one of the options below to get started.";

    useEffect(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullText.length - 1) {
          setDisplayedText((prev) => prev + fullText[index]);
          //console.log(fullText[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 40); // Adjust speed as needed

      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return <div className="animated-text">{displayedText}</div>;
  };

  //getting chatbot response find resources
  const getResources = async (message) => {
    console.log("message: ", message);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/chatbot/find_sim_docs`,
        {
          method: "POST",
          // credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input_text: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }

      const data = await response.json();

      let resourceString = "";

      data.forEach((resources, index) => {
        resourceString += `
        ${index + 1}: ${resources.Resource_title}
        ${resources.Resource_link}
        ${resources.Resource_body}
            `;
      });

      console.log(resourceString);
      
      return resourceString;

    } catch (error) {
      console.error("Error uploading post:", error);
      // Handle error, e.g., display an error message to the user
    } finally {
      setLoading(false); // Once the promise settles, update loading state
    }
  };

  //getting chatbot to do list response
  const getChatBot = async (message) => {
    console.log("message: ", message);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/chatbot/generate_goal_tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input_text: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }

      const data = await response.json();
      let resultString = `Goal: ${data.goal}\n\nSubtasks:\n`;
      data.subtasks.forEach((subtask, index) => {
        resultString += `Subtask ${index + 1}: ${
          subtask.subtask
        }\nImportance: ${subtask.importance}\nFocus: ${subtask.focus}\n`;
      });
      return resultString;
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setLoading(false);
    }
  };

  //getting chatbot to do general conversation
  const getConversation = async (message) => {
    console.log("message: ", message);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/chatbot/generic_chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_question: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }

      const data = await response.json();

      return data.response;
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    let botReply = "";

    const userMessage = { text: input, sender: "user" };

    if (currentId == "cb1") {
      botReply = await getResources(input);
    } else if (currentId == "cb2") {
      botReply = await getChatBot(input);
    } else if (currentId == "cb3") {
      botReply = await getConversation(input);
    }

    //const botReply = await getResources(input);

    setMessages([...messages, userMessage]);
    setInput("");

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

    setTypingMessage("");
    let index = 0;
    const typingInterval = setInterval(() => {
      const currentChar = text.charAt(index);

      if (currentChar === "\n") {
        setTypingMessage((prevText) => prevText + "\n");
      } else {
        setTypingMessage((prevText) => prevText + currentChar);
      }
      index++;

      if (index === text.length) {
        clearInterval(typingInterval);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text, sender: "bot" },
        ]);
        setTypingMessage("");
      }
    }, 10);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSearchBar(true); // Show the search bar when a suggestion is clicked
    setShowAnimatedText(false); // Hide the animated text when a suggestion is clicked

    setCurrentId(suggestion.id);
    console.log("current id", currentId);


    // if (suggestion.text === "General conversation.😊") {
    //   const specialMessage = {
    //     text: "Hello! How is your day?",
    //     sender: "bot",
    //     special: "general-conversation",
    //   };
    //   setMessages([...messages, specialMessage]);
    // } else {
    //   getChatBot(suggestion).then((botResponse) => {
    //     simulateTyping(botResponse); // Display the chatbot response in the chat
    //   });
    // }

    if (suggestion.text === "General conversation.😊") {
       const specialMessage = {
         text: "Hello! How is your day?",
         sender: "bot",
         special: "general-conversation",
       };
       setMessages([...messages, specialMessage]);
       } else {
        getChatBot(suggestion).then((botResponse) => {
        simulateTyping(botResponse); // Display the chatbot response in the chat
      });
    }

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        {showAnimatedText && <AnimatedText />}{" "}
        {/* Only show AnimatedText if showAnimatedText is true */}
        <div className="suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id} // Use the unique ID as the key
                className="suggestion-button"
                style={{
                  backgroundColor: selectedId === suggestion.id ? "#2d00b3" : "",
                  color: selectedId === suggestion.id ? "#fff" : "", // Optional: Change text color for better contrast
                }}
                onClick={() => {
                  setSelectedId(suggestion.id); // Update the selectedId state
                  handleSuggestionClick(suggestion); // Call the existing click handler
                }}
              >
            {suggestion.text}
              </button>
            ))}
        </div>
        <div className="chatbot-messages">
          {/* Add bubbles as the background */}
          {showBubbles &&
            Array.from({ length: 80 }).map((_, index) => (
              <div key={index} className="bubble"></div>
            ))}
          

          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === "bot" ? renderMessageWithLinks(msg.text) : msg.text}
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
