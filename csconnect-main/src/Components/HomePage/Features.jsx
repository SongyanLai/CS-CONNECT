import React from "react";
import "../Stylesheet.css";
import { Link } from "react-router-dom";
import blogimage from "../Assets/blog_page.png";
import chat from "../Assets/chat.png";
import announce from "../Assets/announce.png";


const AboutPage = () => {
  return (
<div className="home-container">
      {/* Main Content Section */}
      <div className="home-main-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title"> . Features .</h1>
          <div className="features-text" >
            <p> <strong>Module-based blog:</strong>Blog page divided up per module to help you get more informed answers, with comments and likes built in.</p>
            <p><strong>Chat functionality:</strong>Communicate efficiently through individual and group messaging options, supporting both academic and social connections.</p>
            <p> <strong>Announcements:</strong>Dedicated announcements page to help you stay up-to-date with module and lecturer updates.</p>
          </div>
          <div className="features-images">
            <img className="features-image" src={blogimage} alt="blog" />
            <img className="features-image" src={chat} alt="chat" />
            <img className="features-image" src={announce} alt="announcement" />
          </div>
          {/* Navigation Buttons */}
      <div className="about-navigation">
        <Link to="/" className="home-button">Home</Link>
        <Link to="/login" className="home-button">Login</Link>
        <Link to="/signup" className="home-button">Signup</Link>
      </div>

        </div>
      </div>
      </div>

  );
};

export default AboutPage;

/**      <div className="home-content">
      <div className="home-main-content">
        <div className="welcome-section">
          <h1 className="welcome-title"> . Features .</h1>
          <div className="home-text"></div>
            <ul className="home-text">
            <li>
              <strong>Module-based blog:</strong> Blog page divided up per module to help you get more informed answers.
            </li>
            <li>
              <strong>Chat functionality:</strong> Communicate efficiently through individual and group messaging options, supporting both academic and social connections.
            </li>
            <li>
              <strong>Lecturer announcements page:</strong> Dedicated announcements page to help you stay up-to-date with module updates.
            </li>
          </ul>
          

          <h1 className="home-title"> . Our Vision .</h1>
          <p className="home-text">
            We aim to create an inclusive space where ideas can flourish, connections can deepen, and the academic
            experience can thrive. With CSConnect, students and lecturers can achieve more together.
          </p>
        </div>
      </div>
      </div> */