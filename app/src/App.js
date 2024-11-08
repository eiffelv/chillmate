import './App.css';
import Home from "./components/home.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Forum from "./components/forum.js";
import About from "./components/about.js";
import Resources from "./components/resources.js";
import Chatbot from "./components/chatbot.js";
import Journal from "./components/journal.js";
import Navbar from "./components/navbar.js";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginProvider } from "./components/LoginContext";  // Import LoginProvider for global state


//this is where all the routing happens
//to add a route just copy from one of the route and change the path into what you want, the name doesn't matter since we're the one who makes the name
//put element <'name of page. /> to connect it
function App() {
  return (
    <div className="App">
      <LoginProvider>  {/* Wrap all routes with LoginProvider */}
        <Router>
          <Navbar />  {/* Navbar at the top to display login/logout based on status */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </Router>
      </LoginProvider>
    </div>
  );
}

export default App;
