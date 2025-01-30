import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/styles/MyBlogs.css";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/my-blogs");
        console.log(res.data);  
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // Handle delete blog
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/delete-blog/${id}`);
        alert(response.data.message);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog. Check console for details.");
      }
    }
  };

  return (
    <div className="blog-container">
      <h2>My Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <img className="blog-image" src={blog.image} alt={blog.title} />
              <div className="blog-details">
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-description">{blog.description}</p>
                <div className="blog-buttons">
                  <button className="delete-button" onClick={() => handleDelete(blog._id)}>
                    Delete
                  </button>
                  <Link className="update-button" to={`/update-blog/${blog._id}`}>Update</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
