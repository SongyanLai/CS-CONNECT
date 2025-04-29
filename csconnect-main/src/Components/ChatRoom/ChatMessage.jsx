import React, { useState, useEffect } from "react";
import { auth, db } from "../databaseCred.jsx";
import { doc, getDoc } from "firebase/firestore";
import { FaUser } from "react-icons/fa";


function ChatMessage(props) {
  // Consts for user name, messages, photos
  const { text, uid, photoURL, imageUrl } = props.message;
  const [userName, setUserName] = useState("Unknown User"); 
  const messageClass = uid === auth.currentUser?.uid ? "sent" : "received";
  const defaultAvatar = <FaUser />;
  
  // Fetch user details from the database
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (uid) {
          const userRef = doc(db, "Users", uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUserName(userDoc.data().name || "Unknown User");
          }
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [uid]);

/*<img
        src={photoURL || defaultAvatar}
        alt="User avatar"
        className="avatar"
        /> */
  return (
    <div className={`message ${messageClass}`}>
      <div className="chat-message-header">
       <span className="chat-user-name">{userName}</span>
      
      </div>


      {imageUrl && text ? (
        <div className="textImg">
          <img src={imageUrl} alt="Uploaded content" />
          <p>{text}</p>
        </div>
      ) : (
        <>
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded content" className="uploadImg" />
          )}
          {text && <p>{text}</p>}
        </>
      )}
    </div>
  );
}

export default ChatMessage;
