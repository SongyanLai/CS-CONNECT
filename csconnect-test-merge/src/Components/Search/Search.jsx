import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../databaseCred";

// Function to fetch users from Firestore
const fetchAllUsers = async () => {
  try {
    const usersCollection = collection(db, "Users");
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => ({
      id: doc.id, // Include ID for key usage
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

function Search() {
  const [searchValue, setSearchValue] = useState(""); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [userList, setUserList] = useState([]); // State for all fetched users
  const searchContainerRef = useRef(null); // Ref for search container

  // Fetch users from Firestore when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();
        setUserList(allUsers); // Store all fetched users
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  // Input change handler for search functionality
  const inputChangeHandler = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Filter the user list by name or email
    if (value) {
      const filtered = userList.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(value.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  // Clear the search input and results
  const clearSearch = () => {
    setSearchValue("");
    setFilteredUsers([]);
  };

  // Handle clicks outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="app">
      <div className="search-container" ref={searchContainerRef}>
        <button className="clear-button" onClick={clearSearch}>
          ✕
        </button>
        <input
          type="text"
          id="search"
          placeholder="Search by name or email"
          value={searchValue}
          onChange={inputChangeHandler}
        />
      </div>

      {/* Display filtered users as overlay */}
      {filteredUsers.length > 0 && (
        <div className="overlay">
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <strong>{user.name || "Unnamed User"}</strong> - {user.email || "No Email Available"}
              </li>
              
            ))}
          </ul>
          
        </div>
      )}
    </div>
  );
}

export default Search;
