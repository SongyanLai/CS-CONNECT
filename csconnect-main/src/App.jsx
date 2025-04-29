import React, { useState, useEffect } from "react";
import "./Components/Stylesheet.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./Components/databaseCred.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

// Import app components
import BlogPage from "./Components/BlogPage/BlogPage.jsx";
import NavBar from "./Components/Nav/NavBar.jsx";
import Signup from "./Components/LoginSignup/Signup.jsx";
import Login from "./Components/LoginSignup/Login.jsx";
import SignOut from "./Components/LoginSignup/Signout.jsx";
import Chat from "./Components/ChatRoom/Chat.jsx";
import HomePage from "./Components/HomePage/HomePage.jsx";
import About from "./Components/HomePage/About.jsx"
import Features from "./Components/HomePage/Features.jsx";
import UserProfile from "./Components/UserProfile/UserProfile.jsx";
import AnnouncementPage from "./Components/AnnouncementPage/AnnouncementPage.jsx";

function App() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [user, loading] = useAuthState(auth);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <title>CSConnect</title>
      <div className="app-layout">
        <NavBar onCourseSelect={handleCourseSelect} selectedCourse={selectedCourse} />
        <Routes>
          <Route path="/" element={<HomePage selectedCourse={selectedCourse}/>} />
          <Route path="/blog" element={<BlogPage selectedCourse={selectedCourse} />} />
          <Route path="/chat" element={<Chat selectedCourse={selectedCourse} />} />
          <Route path="/announcements" element={<AnnouncementPage selectedCourse={selectedCourse} />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
        </Routes>
          <footer className="footer">
            <p>&copy; 2024 CSConnect. All rights reserved.</p>
         </footer>
      </div>
    </Router>
  );
}

export default App;
