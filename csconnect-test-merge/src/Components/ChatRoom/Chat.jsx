import React, { useState, useEffect } from "react";
import "../Stylesheet.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../databaseCred.jsx";
import { useNavigate } from "react-router-dom";


// Import database connections
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Import Components
import ChatRoom from "./ChatRoom";

function Chat({ selectedCourse }) {
  const [username, setUsername] = useState("");
  const [user] = useAuthState(auth); // user constant
  const navigate = useNavigate(); // React Router's navigate function
  document.title = "CSConnect";

  useEffect(() => {
    // Redirect unauthenticated users to the /signin page
    if (!user) {
      navigate("/login");
    }

    // Fetch username from local storage or auth context after login/signup
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.username) {
      setUsername(storedUser.username);
    }
  }, [user, navigate]); // Re-run when `user` changes

  return (
    <div className="chat-room">
      {user && <ChatRoom selectedCourse={selectedCourse}/>}
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

export default Chat;


