import "../Stylesheet.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../databaseCred.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Icon imports
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";



function Login () {
  const navigate = useNavigate(); //renaming useNavigate();

  //useStates
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);  //Verification to check if account exists
      console.log("SUCCESS");
      navigate("/BlogPage.jsx");  //If exists continite to blog page

      //Functions to get and save current logged in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user.uid;
      const docRef = doc(db, "users", user);{
        try{
          getDoc(docRef);
          console.log(getDoc(docRef));
          console.log(auth.currentUser.uid);
        }catch(error){
          console.log(error);
        }
      }
    } catch (error) {
      alert(error.message);
    }
    
  }


  return (
    <div className="signup-login-container">
        <h1 className="h1-lg-su" >Login</h1>  {/* Title for container */}
      <div className="inputs">
        <div className="input">
          <FaUser size={20} transform={"down-6"}/>
          {/* Email input */}
          <input
            className="input-box"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  //sets input value to a email var
          />
        </div>
        <div className="input">
          <MdOutlinePassword size={20} transform={"down-6"}/>
          {/* Password input */}
          <input
            className="input-box"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} //sets input value to password var
          />
        </div>
      </div>
      <div className="submit-conatiner">
        
        <button className="submit gray" onClick={handleLogin}>  {/* call handleLogin function on button press */}
          Login
        </button>
      </div>
      <div className="Navigate-to-signup">
        {/* reroute to signup page on button press */}
        <h3>Meant to signup? Click Here:</h3>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
