import React from "react";
import { Link } from "react-router-dom";
import "../Stylesheet.css";

const AboutPage = () => {
  return (
    <div className="home-container">
      <div className="home-main-content" >
      <div className="welcome-section">
        <h1 className="welcome-title">. About .</h1>
        <p className="about-text">
          The new standard for University Communication tools.
        </p>
      </div>

      {/* About Content Section */}
        <div className="welcome-section">
          <h2 className="h2-title">. Project Overview .</h2>
          <p className="about-text">
            CSConnect is a cutting-edge solution designed to address the communication and collaboration
            needs of university students and lecturers. It offers a centralized platform for sharing ideas,
            fostering discussions, and staying connected with the academic community.
          </p>

          <h2 className="h2-title">. Our Vision .</h2>
          <p className="about-text">
            We aim to create an inclusive space where ideas can flourish, connections can deepen, and the academic
            experience can thrive. With CSConnect, students and lecturers can achieve more together.
           </p>


      </div>

      {/* Navigation Buttons */}
      <div className="about-navigation">
        <Link to="/" className="home-button">Home</Link>
        <Link to="/login" className="home-button">Login</Link>
        <Link to="/signup" className="home-button">Signup</Link>
      </div>
      </div>
    </div>
  );
};

export default AboutPage;
