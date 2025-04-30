import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../databaseCred.jsx";
import "../Stylesheet.css";
import { doc, addDoc, getDocs, arrayUnion, Timestamp, collection, getDoc, updateDoc, deleteDoc, onSnapshot  } from "firebase/firestore";


const HomePage = ({ selectedCourse, }) => {
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState("Unknown User");


  // Fetch posts from Firestore on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
  const collectionName = selectedCourse ? `${selectedCourse}-posts` : 'Htf3CXaMfBXjIhNRVjWZ-posts';

  const postsSnapshot = await getDocs(collection(db, collectionName));

  const newPosts = postsSnapshot.docs.map((doc) => {
    const post = doc.data();
    const date = post.datePosted instanceof Timestamp ? post.datePosted.toDate() : post.datePosted; // Handle both Timestamp and Date types
    return {
      id: doc.id,
      course: selectedCourse || 'Default Course', // Assign a fallback value for `course`
      content: post.content,
      topics: post.tags,
      date: date,
      dateString: date.toLocaleString(),
      author: post.author,
      avatar: "Screenshot.png",
      likes: post.likes,
      comments: post.comments,
    };
  });

  // Sort posts from newest to oldest
  newPosts.sort((a, b) => b.date - a.date);

  // Update state with the sorted posts
  setPosts(newPosts);
} catch (error) {
  console.error('Error fetching posts:', error);
}
    };

    fetchPosts();
  }, []);




  return (
    <div className="home-container">
      {/* Main Content Section */}
      <div className="home-main-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title"> . Welcome to CSConnect .</h1>
          <div className="home-text" >
            <p className="welcome-subheader">The new way for students and lecturers to connect.</p>
            <p className="quote">Brought to you by Team14</p>
          </div>
          
          <div className="about-navigation">
            <Link to="/signup" className="home-button">Signup</Link>
            <Link to="/login" className="home-button">Login</Link>
          </div>
        </div>
      </div>
      </div>

  );
};

export default HomePage;
