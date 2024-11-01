import './App.css';
import Home from "./components/home.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Forum from "./components/forum.js";
import About from "./components/about.js";
import Resources from "./components/resources.js";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chatbot from "./components/chatbot.js";
import Journal from "./components/journal.js";

//this is where all the routing happens
//to add a route just copy from one of the route and change the path into what you want, the name doesn't matter since we're the one who makes the name
//put element <'name of page. /> to connect it
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/chatbot" element={<Chatbot/>} />
          <Route path="/journal" element={<Journal/>} />
        </Routes>
  );
}

export default App;
