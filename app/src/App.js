import './App.css';
import React from 'react';
import Home from "./components/home.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Forum from "./components/forum.js";
import About from "./components/about.js";
import Resources from "./components/resources.js";
import Chatbot from "./components/chatbot.js";
import Journal from "./components/journal.js";
import Profile from './components/Profile';
import Navbar from "./components/navbar.js";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LoginProvider } from "./components/LoginContext";  // Import LoginProvider for global state

// App Component that uses the Router and conditional Navbar rendering
function App() {
  return (
    <LoginProvider>  {/* Wrap all routes with LoginProvider */}
      <Router>
        <NavbarWithLocation /> {/* Navbar component with location-based logic */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </LoginProvider>
  );
}

// This component will use `useLocation` hook to conditionally render the Navbar
function NavbarWithLocation() {
  const location = useLocation();  // This can now safely be used since it's inside a Router

  // Conditionally render the Navbar only for the Profile page
  return location.pathname !== "/Profile" ? <Navbar /> : null;
}

export default App;
