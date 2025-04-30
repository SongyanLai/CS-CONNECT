import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../databaseCred.jsx";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Icon imports
import { IoArrowRedoCircle } from "react-icons/io5";
import { RiVideoUploadFill } from "react-icons/ri";

// JSX imports
import ChatMessage from "./ChatMessage";

// Initialize Firestore and Storage
const storage = getStorage();

function ChatRoom({ selectedCourse }) {
  const [formValue, setFormValue] = useState("");
  const [img, setImg] = useState(null);
  const dummy = useRef();

  // Messages reference and query based on selected course
  const messagesRef = selectedCourse? collection(db,`${selectedCourse}-messages`)  : null;
  const messagesQuery = messagesRef
    ? query(messagesRef, orderBy("createdAt"))
    : null;
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });

  // Ensure the messages collection exists
  useEffect(() => {
    const ensureMessagesCollectionExists = async () => {
      if (selectedCourse) {
        const collectionName = `${selectedCourse}-messages`;
        const messagesSnapshot = await getDocs(collection(db, collectionName));
        if (messagesSnapshot.empty) {
          await setDoc(doc(collection(db, collectionName)), {
            text: "Welcome to the for " + collectionName,
            createdAt: serverTimestamp(),
            uid: "system",
            photoURL: null,
          });
        }
      }
    };

    ensureMessagesCollectionExists();
  }, [selectedCourse]);

  const sendMessage = async (e) => {
    e.preventDefault();

    // Guard against invalid states
    if (!auth.currentUser) {
      alert("Please log in to send a message.");
      return;
    }
    if (!messagesRef) {
      alert("No course selected. Please select a course to send a message.");
      return;
    }

    const { uid, photoURL } = auth.currentUser;
    let imageUrl = null;

    // Upload image if provided
    if (img) {
      const imgRef = ref(storage, `files/${img.name}`);
      const uploadResult = await uploadBytes(imgRef, img);
      imageUrl = await getDownloadURL(uploadResult.ref);
    }

    // Add the message to Firestore
    try {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
        imageUrl,
      });

      setFormValue("");
      setImg(null);
      dummy.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImg(file);
    } else {
      alert("Please upload a PNG or JPG image.");
    }
  };

  // Fallback message for no selected course
  if (!selectedCourse) {
    return <p>Please select a course to view or send messages.</p>;
  }

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <div className="chat-input">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Say something nice"
          />

          <button type="submit" disabled={!formValue && !img}>
            <IoArrowRedoCircle />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatRoom;

/*

          

          <button
            type="button"
            onClick={() => document.getElementById("upload-button").click()}
            style={{ cursor: "pointer" }}
          >
            <RiVideoUploadFill />
          </button>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="upload-button"
          /> */