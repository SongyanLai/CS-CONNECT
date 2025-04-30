import "../Stylesheet.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, db } from "../databaseCred.jsx";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc , getDoc} from "firebase/firestore";

// Icon imports
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { MdOutlineNumbers } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { VscBlank } from "react-icons/vsc";

function Signup() {
  //rename useNavigate()
  const navigate = useNavigate();

  //set usestates
  const [name, setname] = useState("");
  const [StdNum, setStdNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (event) => {
    //regex for email and password to fit specific paramenters (@mumail.ie, password rules )
  const regExe = /[a-zA-Z0-9]+@[mumail]+\.[ie]/; // Match @mumail.ie
  const regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, 1 letter, 1 number
  event.preventDefault();


  //function for verifying that passords match and email is @mumail.ie (& !null)
  try {
    if (password !== confirmPassword) {
      throw new Error('"Password" and "Confirm Password" do not match');
    } else if (!regExe.test(email) || email === "") {
      throw new Error("Invalid Email");
    } else if (!regExp.test(password) || password === "") {
      throw new Error("Invalid Password");
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    //save id of new user
    const user = userCredential.user.uid;
    const userEmail = userCredential.user.email;
    const accessLevel = 0;

    // Check if user document already exists (not necessary here unless required)
    const docRef = doc(db, "Users", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("User already exists:", docSnap.data());
    } else {
      console.log("User does not exist. Creating new document...");
    }

    // Add user to Firestore
    await setDoc(docRef, {
      accessLevel: accessLevel,
      email: userEmail,
      name: name,
      StdNum: StdNum,
    });

    navigate("/BlogPage.jsx"); // Redirect to blog page
  } catch (error) {
    alert(error.message); // Display error message
    console.error(error);
  }
};

  return (
    <form className="signup-login-container"> {/* Title */}
        <h1> Sign Up</h1>
      <div className="inputs">
        <div className="input">
          <FaUser size={20}/>
          {/* Name input */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setname(e.target.value)} //set input value to var
          />
        </div>
        <div className="input">
          <MdOutlineNumbers size={20} />
          {/* Std Number input */}
          <input
            type="text"
            placeholder="Student Number"
            value={StdNum}
            onChange={(e) => setStdNum(e.target.value)} //set input value to var
          />
        </div>
        <div className="input">
          <MdEmail size={20} />
          {/* Email input */}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  //set input value to var
          />
        </div>
        <div className="input">
          <MdOutlinePassword size={20}/>
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} //set input value to var
          />
        </div>
        <div className="input">
          <VscBlank size={20} />
          {/* Repeat password input */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}  //set input value to var
          />
        </div>
      </div>
      <div className="submit-conatiner">
        <button type="submit" className="submit gray" onClick={handleSignup}> {/* Call handleSignup function on button press */}
          Sign Up
        </button>
        
      </div>
      <div className="Navigate-to-signup">
        {/* Reroute to login on press */}
        <h3>Meant to login? Click Here:</h3>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </form>
  );
}

export default Signup;
