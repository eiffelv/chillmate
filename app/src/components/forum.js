import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import { logoutUser } from "./Logout";
import "./style.css";
import "./ChillMateLogo.png";

const Forum = () => {
  // State to handle form inputs and posts
  const [topic, setTopic] = useState("");
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { isLoggedIn, logout } = useContext(LoginContext); // Get login state and logout function
  const navigate = useNavigate();

  useEffect(() => {
    const getForumPost = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_FLASK_URI}/forum/getForum`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch forum posts");
        }

        const data = await response.json();
        console.log("useEffect running");
        console.log("dapetnya", data);

      const formattedPosts = await Promise.all(
        data.map(async post => ({
          id: post._id || "",
          topic: post.Topic || "Untitled",
          content: post.Text || "",
          liked: await checkLike(post._id)
        }))
      );
      console.log("formattedPosts: ", formattedPosts);

        setPosts(formattedPosts);

        return data;
      } catch (error) {
        console.error("Error fetching forum posts:", error);
        if (isLoggedIn) {
          logoutUser(logout, navigate);
        }
      }
    };
    getForumPost();
  }, [isLoggedIn, logout, navigate]);

  //function to create forum posts
  const uploadPost = async (newPost) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/forum/createForum`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPost),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }

      const data = await response.json();
      console.log(data);
      // Handle success or error based on the response data
    } catch (error) {
      console.error("Error uploading post:", error);
      // Handle error, e.g., display an error message to the user
      if (isLoggedIn) {
        logoutUser(logout, navigate);
      }
    }
  };

  //check if forum posts is liked by particular user or not
  async function checkLike(id) {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/forum/checkLike`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(id),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check like status");
      }

      const data = await response.json();
      console.log("datanya dpt ini:", data);
      if(data.relation == 0) {
        console.log("kasih false");
        return false;
      }
      else {
        console.log("kasih true");
        return true
      }
      return data
      // Handle success or error based on the response data
    } catch (error) {
      console.error("Error checking status:", error);
      // Handle error, e.g., display an error message to the user
    }
  }

  // Handle form submission to add new posts
  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() === "" || postContent.trim() === "") {
      alert("Please fill out both fields!");
      return;
    }

    // Create a new post object and add it to the posts array
    const newPost = {
      topic,
      content: postContent,
      liked: false,
    };

    uploadPost(newPost);
    console.log(newPost);
    setPosts([newPost, ...posts]); // Add new post to the beginning of the posts array
    setTopic(""); // Clear form fields
    setPostContent("");
    setShowForm(false);
  };


  //create a relation to the database, that sends the userID and postID
  const createLike = async(id) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/forum/createRelation`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(id),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }

      const data = await response.json();
      console.log(data);
      // Handle success or error based on the response data
      } catch (error) {
        console.error("Error creating relation:", error);
        // Handle error, e.g., display an error message to the user
      }
  };

  const unlike = async(id) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLASK_URI}/forum/deleteRelation`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(id),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload post");
      }

      const data = await response.json();
      console.log(data);
      // Handle success or error based on the response data
      } catch (error) {
        console.error("Error creating relation:", error);
        // Handle error, e.g., display an error message to the user
      }
  };


  // Toggle like status for a post
  const toggleLike = (index) => {
    const updatedPosts = posts.map((post, i) => {
      
      if (i === index) {
        console.log(post.id);

        //if the post is false, then it will turn to true
        //this means create a relation
        if(post.liked == false) {
          createLike(post.id);
        }
        else {
          //else if the post is true, it will turn to false
          //remove the relation from the new collection
          console.log("delete relation");
          unlike(post.id);

        }

        return { ...post, liked: !post.liked };
        
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div className="forum">
      {/* Forum Page */}
      <div className="container1">
        <h1>Forum</h1>
        <br />

        {/* Posts Section */}
        <div className="posts-section">
          <h2>Posts</h2>
          <button className="postbutton" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "+"}
          </button>
          {/* Post Form */}
          <div className="create-post-section">
            {showForm && (
              <div className="post-form">
                <h2>Create a New Post</h2>
                <form id="postForm" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Topic"
                    required
                  />
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Write something..."
                    required
                  />
                  <button className="postbutton" type="submit">
                    +
                  </button>
                </form>
              </div>
            )}
            <ul className="forumul" id="postsList">
              {posts.map((post, index) => (
                <li key={index} className="post-item">
                  <div className="post-author">{post.topic}</div>
                  <div className="post-content">{post.content}</div>

                  {/* Like Button */}
                  <div className="like-container">
                    <button
                      className={`like-btn ${post.liked ? "liked" : ""}`}
                      onClick={() => toggleLike(index)}
                    >
                      <span className="like-icon">👍</span>
                      <span className="like-text">
                        {post.liked ? "Liked" : "Like"}
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
