import { auth } from "../databaseCred.jsx";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function SignOut() {
  //renaming useNavigate()
  const navigate = useNavigate();
  try {
    //firebase function to signout of user and remove saved user id
    auth.signOut();
    navigate("/Login.jsx");
  } catch (err) {
    console.log(err);
  }
}

export default SignOut;
