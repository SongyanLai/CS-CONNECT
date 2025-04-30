import React, { useState, useEffect } from "react";
import {auth, db} from "../databaseCred.jsx"
import {doc, getDoc} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Stylesheet.css";


// User profile page component
const UserProfile = () => {
  const { userId } = useParams(); // Retrieve userId from route parameters
  const [profile, setProfile] = useState(null); // User profile data

  // Fetch user profile from API or use mock data if unavailable
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Attempt to fetch profile data from an API
        try{
          const data = (await getDoc(doc(db,"Users",userId))).data();
          setProfile(data);
        }
        catch {
          throw new Error("Failed to fetch data from server.");
        }
      } catch {
        // Fallback to mock data
        const mockProfiles = {
          123: {
            name: "Alice",
            studentId: "A123",
            email: "alice@example.com",
            major: "Computer Science",
          },
          456: {
            name: "Bob",
            studentId: "B456",
            email: "bob@example.com",
            major: "Engineering",
          },
        };
        setProfile(mockProfiles[userId]);
      }
    };

    fetchProfile();
  }, [userId]);

  // Show loading message while data is being fetched
  if (!profile) {
    return <p>Loading...</p>;
  }

  // Render user profile details
  return (
    <>
    <div className="user-profile-card">
      
        <h2>User Profile</h2>
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Student ID:</strong> {profile.StdNum}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Major:</strong> {profile.major}
        </p>
    </div>
      <Link to="/signout">
          <button className="nav-button">Sign Out</button>
        </Link>
      
  </>
  );
};

export default UserProfile;
