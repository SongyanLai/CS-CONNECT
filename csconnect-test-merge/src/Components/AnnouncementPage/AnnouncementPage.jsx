import React, { useEffect, useState } from "react";
import { auth, db } from "../databaseCred.jsx";
import "../Stylesheet.css";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDocs, addDoc, arrayUnion, Timestamp, collection, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

// Modules database
const modulesRef = collection(db, 'Modules');
// Users database
const usersRef = collection(db, 'Users');

function AnnouncementPage({ selectedCourse }) {
  const [userInfo, setUserInfo] = useState({});
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [userAccessLevel, setUserAccessLevel] = useState(0);

  // Fetch announcements when selectedCourse changes
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (selectedCourse) {
        try {
          const announcementsSnapshot = await getDocs(collection(db, `${selectedCourse}-announcements`));
          const newAnnouncements = announcementsSnapshot.docs.map((doc) => {
            const announcement = doc.data();
            const date = announcement.datePosted instanceof Timestamp
              ? announcement.datePosted.toDate()
              : announcement.datePosted;  // Handle both Timestamp and Date types
            return {
              id: doc.id,
              author: announcement.author,
              content: announcement.content,
              date: date
            };
          });

          newAnnouncements.sort((a, b) => b.date - a.date);
          setAnnouncements(newAnnouncements);
        } catch (error) {
          console.error("Error fetching announcements:", error);
        }
      }
    };

    if (selectedCourse) {
      fetchAnnouncements();
    }
  }, [selectedCourse]);

  // Fetch user data and access level
  useEffect(() => {
    const fetchUserData = async () => {
      const userSnapshot = await getDocs(usersRef);
      const userInfoMap = {};
      userSnapshot.forEach((doc) => {
        userInfoMap[doc.id] = doc.data().name;
      });
      setUserInfo(userInfoMap);
    };

    fetchUserData();
  }, []);

  // Listen for authentication state changes and set user access level
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userSnapshot = await getDoc(doc(usersRef, user.uid));
        const userData = userSnapshot.data();
        setUserAccessLevel(userData?.accessLevel || 0);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  // Form submit function to create a new announcement
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (announcementText.trim() && selectedCourse) {
      try {
        const data = addDoc(collection(db,`${selectedCourse}-announcements`),{
          author: auth.currentUser.uid,
          content: announcementText,
          datePosted: Timestamp.now()
        })
        const newAnnouncement = {
          id: data.id,
          author: auth.currentUser.uid,
          content: announcementText,
          datePosted: Timestamp.now()
        };

        const newAnnouncements = {
          ...newAnnouncement
        };

        setAnnouncements([newAnnouncements, ...announcements]);
        setAnnouncementText(""); // Clear the input field
      } catch (error) {
        console.error("Error creating announcement:", error);
      }
    }
  };

  return (
    <div className="announcements-container">
      {userAccessLevel > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="announcementText">Announcement Text:</label><br></br>
            <input className="announcements-input"
              type="text"
              id="announcementText"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
            />
          </div>
          <button className="announcements-button" type="submit">Create Announcement</button>
        </form>
      )}
      {announcements.length > 0 ?
      (announcements.map((announcement, index) => (
        <div key={index} className="announcement">
          <strong>{userInfo[announcement.author] || 'Unknown User'}:</strong> {announcement.content}
        </div>
      ))) : (<p style={{margin: "20px"}}>No Announcements</p>)
    }
    </div>
  );
}

export default AnnouncementPage;
