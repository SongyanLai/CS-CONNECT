import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../Stylesheet.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../databaseCred.jsx"; // Adjust path if needed
import { doc, addDoc, getDocs, arrayUnion, Timestamp, collection, getDoc, updateDoc, deleteDoc, onSnapshot  } from "firebase/firestore";

// BlogPage Component
function BlogPage({ selectedCourse }) {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const topics = [
    "Gitlab",
    "Balsamiq",
    "React",
    "SQL",
    "Databases",
    "Firebase",
    "SCRUM",
    "JavaScript",
    "Node.js",
    "Kubernetes",
    "VSCode + Copilot",
  ];

   // Function for getting all posts to display onload
  useEffect(() => {
    const fetchPosts = async () => {
      if (selectedCourse) {
        try {
          // Fetch posts from the Firestore collection
          const postsSnapshot = await getDocs(collection(db, `${selectedCourse}-posts`));
          
          // Map over the documents to extract and transform data
          const newPosts = postsSnapshot.docs.map((doc) => {
            const post = doc.data();
            const date = post.datePosted instanceof Timestamp
              ? post.datePosted.toDate()
              : post.datePosted;  // Handle both Timestamp and Date types
            return {
              id: doc.id,
              course: selectedCourse,
              content: post.content,
              topics: post.tags,
              date: date,
              dateString: date.toLocaleString(),
              author: post.author,
              avatar: "Screenshot.png",
              likes: post.likes,
              comments: post.comments,
            };
          });

          // Sort posts from newest to oldest
          newPosts.sort((a, b) => b.date - a.date);
          setPosts(newPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };
  
    fetchPosts();
  }, [selectedCourse, selectedTopics]);

  // Function to handle adding a new post
  const handlePost = () => {
    if (newPostContent.trim()) {
      const data=addDoc(collection(db,`${selectedCourse}-posts`),{
        author: auth.currentUser.uid,
        content: newPostContent,
        datePosted: Timestamp.now(),
        likes: 0,
        comments: [],
        usersWhoLiked: [],
        tags: selectedTopics
      })
      const newPost = {
        id: data.id,
        course: selectedCourse,
        content: newPostContent,
        topics: selectedTopics,
        date: Timestamp.now(),
        author: auth.currentUser.uid,
        avatar: "Screenshot.png",
        likes: 0,
        comments: [],
        tags: selectedTopics
      };
      // Add the new post to the list of posts
      setPosts([newPost, ...posts]);
      // Clear the new post content and selected topics
      setNewPostContent("");
      setSelectedTopics([]);
    }
  };
  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));  // Update posts state after deletion
  };


  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="blog-page">
      <div className="Sidebar">
        <Sidebar
          topics={topics}
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="Post-Content">
        <PostArea
          posts={posts}
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
          handleDeletePost={handleDeletePost}
          handlePost={handlePost}
          selectedCourse={selectedCourse}
        />
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({
  topics,
  selectedTopics,
  toggleTopic,
  selectedDate,
  setSelectedDate,
}) {
  return (
    <div className="sidebar">
      <div className="calendar">
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="topics">
        <h1>Topics</h1>
        <ul>
          {topics.map((topic) => (
            <li
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={selectedTopics.includes(topic) ? "selected" : ""}
            >
              - { topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Post Area Component
function PostArea({
  posts,
  newPostContent,
  setNewPostContent,
  handleDeletePost,
  handlePost,
  selectedCourse,
}) {
  return (
    <div className="post-area">
      <input
        className="post-input"
        type="text"
        placeholder="Enter post content..."
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <button onClick={handlePost}>Post</button>
      {posts.map((post, index) => (
        <Post key={index} post={post} selectedCourse={selectedCourse} handleDeletePost={handleDeletePost}/>
      ))}
    </div>
  );
}

// Individual Post Component
function Post({ post, selectedCourse, handleDeletePost }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [userName, setUserName] = useState("Unknown User");
  const [userColor, setUserColor] = useState({});
  const [userNamesMap, setUserNamesMap] = useState({}); // Cache for comment authors
  const [bgColor, setBgColor] = useState("white");
  const navigate = useNavigate();

  useEffect(() => {
    // Whenever post.comments changes, update the local comments state
    setComments(post.comments);
  }, [post.comments]); // This will run whenever post.comments changes

  // Fetch post author's name and background color
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (post.author) {
        try {
          const authorRef = doc(db, "Users", post.author);
          const authorData = (await getDoc(authorRef)).data();
          if (authorData) {
            setUserName(authorData.name || "Unknown User");
            const accessLevel = authorData.accessLevel;

            let color = "";
            switch (accessLevel) {
              case 0:
                color = "white";
                break;
              case 1:
                color = "beige";
                break;
              default:
                color = "white";
            }
            setBgColor(color);
          }
        } catch (error) {
          console.error("Error fetching author data:", error);
        }
      }
    };
    fetchAuthorData();
  }, [post.author]);

  // Fetch names for comment authors
  useEffect(() => {
    const fetchCommentAuthors = async () => {
      const updatedUserNamesMap = { ...userNamesMap };
      var userColorMap = {};
      for (const comment of comments) {
        if (!updatedUserNamesMap[comment.author]) {
          try {
            const authorRef = doc(db, "Users", comment.author);
            const authorData = (await getDoc(authorRef)).data();
            updatedUserNamesMap[comment.author] = authorData?.name || "Unknown User";
            const accessLevel = authorData.accessLevel;
            let color="";
            switch (accessLevel) {
              case 0:
                color = "white";
                break;
              case 1:
                color = "beige";
                break;
              default:
                color = "white"; // Default color
            }
            userColorMap[comment.author]=color;
          } catch (error) {
            console.error("Error fetching comment author data:", error);
            updatedUserNamesMap[comment.author] = "Unknown User";
            userColorMap[comment.author]="white";
          }
        }
      }
      //console.log(userColor);
      setUserColor(userColorMap); 
      setUserNamesMap(updatedUserNamesMap);
    };
    fetchCommentAuthors();
  }, [comments]);

  const handleLike = async () => {
    try {
      const postRef = doc(db, `${selectedCourse}-posts`, post.id);
      const postData = (await getDoc(postRef)).data();

      if (!postData) {
        console.error("No data found for this post.");
        return;
      }

      const usersWhoLiked = postData.usersWhoLiked || [];
      const isLiked = usersWhoLiked.includes(auth.currentUser.uid);

      if (isLiked) {
        await updateDoc(postRef, {
          likes: postData.likes - 1,
          usersWhoLiked: usersWhoLiked.filter((uid) => uid !== auth.currentUser.uid),
        });
        setLikes(postData.likes - 1);
      } else {
        await updateDoc(postRef, {
          likes: postData.likes + 1,
          usersWhoLiked: [...usersWhoLiked, auth.currentUser.uid],
        });
        setLikes(postData.likes + 1);
      }
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    const postRef = doc(db, `${selectedCourse}-posts`, post.id);
    if (newComment.trim()) {
      const comment = {
        author: auth.currentUser.uid,
        avatar: "CommenterAvatar.png",
        content: newComment,
        date: Timestamp.now()
      };
      // Update Firestore
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });
      // Fetch the updated post data to sync the post comments
      const updatedPost = (await getDoc(postRef)).data();
      setComments(updatedPost.comments);  // Update the local comments state
      setNewComment("");  // Clear the comment input field
    }
  };


  const handleDelete = async () => {
    try {
      // Delete the post from Firestore
      const postRef = doc(db, `${selectedCourse}-posts`, post.id);
      await deleteDoc(postRef);
      // Remove post from state
      handleDeletePost(post.id);
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  // Sort comments from newest to oldest
  comments.sort((a, b) => b.date - a.date);

  return (
    <div className="post" style={{ backgroundColor: bgColor }}>
      <div className="post-header">
        <button
          style={{ color: "blue" }}
          onClick={() => navigate(`/user/${post.author}`)}
        >
          {userName}
        </button>
        {auth.currentUser.uid === post.author && (
          <button onClick={handleDelete}>🗑️ Delete</button>
        )}
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-footer">
        <span>Tags: {post.topics.join(", ")}</span>
        <span>Date: {post.date.toLocaleString()}</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>👍 {likes} Likes</button>
        <button onClick={() => alert("Share functionality coming soon!")}>
          🔄 Share
        </button>
        <button onClick={() => setShowComments(!showComments)}>
          💬 {comments.length} Comments
        </button>
      </div>
      {showComments && (
        <div className="post-comments">
          <h3>Comments:</h3>
          {comments.map((comment, index) => (
            <div key={index} className="comment" style={{ backgroundColor: userColor[comment.author] }}>
              <span
                className="comment-author"
                onClick={() => navigate(`/user/${comment.author}`)}
              >
                {userNamesMap[comment.author] || "Unknown User"}
              </span>
              <span className="comment-date">
                {comment.date.toDate().toLocaleString()}
              </span>
              <p>{comment.content}</p>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
