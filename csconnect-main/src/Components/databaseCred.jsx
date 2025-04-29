import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADkyHoEn4e8o4SiDuyj0YshEE6I0YlLSM",
  authDomain: "csconnect-7aa17.firebaseapp.com",
  projectId: "csconnect-7aa17",
  storageBucket: "csconnect-7aa17.appspot.com",
  messagingSenderId: "86083438061",
  appId: "1:86083438061:web:566ecc8b1e633d247093e4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };