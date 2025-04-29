import React, { useEffect, useState } from "react";
import "../Stylesheet.css"; // Add relevant styles
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../databaseCred.jsx";

import Search from "../Search/Search.jsx";

function NavBar({ onCourseSelect, selectedCourse }) {
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Track the current user
  const location = useLocation(); // Detect current route
  const navigate = useNavigate(); // Used for navigation

  useEffect(() => {
    // Check auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user); // Update currentUser when the auth state changes

      // If not signed in, redirect to login
      if (!user && location.pathname !== "/login" && location.pathname !== "/signup") {
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, [navigate]);

  useEffect(() => {
    // Fetch modules for the `/blog` route
    const fetchModules = async () => {
      try {
        const modulesRef = collection(db, "Modules");
        const modulesSnapshot = await getDocs(modulesRef);

        const courseList = modulesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Unnamed Course", // Default if no name
        }));
        setCourses(courseList);

        // Optionally set the first course as default
        if (
          courseList.length > 0 &&
          (location.pathname === "/blog" || location.pathname === "/chat" || location.pathname === "/announcements") &&
          !selectedCourse
        ) {
          onCourseSelect(courseList[0].id);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    if (location.pathname === "/blog" || location.pathname === "/chat" || location.pathname === "/announcements") {
      fetchModules();
    }
  }, [location.pathname, selectedCourse, onCourseSelect]);

  const handleCourseSelect = (course) => {
    onCourseSelect(course.id);
  };

  // Determine if we need to show home specific lower-tier navigation
  const isHomeRelatedRoute = ["/", "/about", "/features"].includes(
    location.pathname
  );

  return (
    <div>
      <header className="navbar">
                <Search />

        <Link to="/" className="nav-title">
          <h2>CSConnect</h2>
        </Link>

        <Link to="/chat">
          <button className="nav-button">Chat</button>
        </Link>

        <Link to="/blog">
          <button className="nav-button">Blog</button>
        </Link>

        <Link to="/announcements">
          <button className="nav-button">Announcements</button>
        </Link>


        {currentUser && (
          <Link to={`/user/${currentUser.uid}`}>
            <button className="nav-user-icon">
              <FaUser />
            </button>
          </Link>
        )}
      </header>

      {/* Lower Tier */}
      {isHomeRelatedRoute && (
        <div className="lower-tier">
          <nav className="lower-tier-nav">
            <Link to="/about" className="lower-tier-nav-link">
              About
            </Link>
            <Link to="/features" className="lower-tier-nav-link">
              Features
            </Link>
          </nav>
        </div>
      )}

      {/* Blog Modules Navigation */}
      {location.pathname === "/blog" && (
        <div className="lower-tier">
          <nav className="lower-tier-nav">
            {courses.map((course) => (
              <Link
                to="/blog"
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                className={`lower-tier-nav-link ${
                  selectedCourse === course.id ? "active" : ""
                }`}
              >
                {course.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Chat Modules Navigation */}
      {location.pathname === "/chat" && (
        <div className="lower-tier">
          <nav className="lower-tier-nav">
            {courses.map((course) => (
              <Link
                to="/chat"
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                className={`lower-tier-nav-link ${
                  selectedCourse === course.id ? "active" : ""
                }`}
              >
                {course.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Announcement Modules Navigation */}
      {(location.pathname === "/announcements" ) && (
        <div className="lower-tier">
          <nav className="lower-tier-nav">
            {courses.map((course) => (
              <Link
                to="/announcements"
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                className={`lower-tier-nav-link ${
                  selectedCourse === course.id ? "active" : ""
                }`}
              >
                {course.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export default NavBar;
