import "./App.css";
import React from "react";
import Home from "./components/home.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Forum from "./components/forum.js";
import About from "./components/about.js";
import Resources from "./components/resources.js";
import Chatbot from "./components/chatbot.js";
import Journal from "./components/journal.js";
import Profile from "./components/profile.js";
import Navbar from "./components/navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginProvider } from "./components/LoginContext"; // Import LoginProvider for global state

// App Component that uses the Router and conditional Navbar rendering
function App({ router = true }) {
  const AppContent = () => (
    <LoginProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/about" element={<About />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </LoginProvider>
  );

  return router ? (
    <Router>
      <AppContent />
    </Router>
  ) : (
    <AppContent />
  );
}

export default App;
