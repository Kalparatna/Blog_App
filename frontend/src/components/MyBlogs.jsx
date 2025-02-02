import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/styles/MyBlogs.css";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("https://blog-app-backend-indol-pi.vercel.app/my-blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await axios.delete(`https://blog-app-backend-indol-pi.vercel.app/delete-blog/${id}`);
        alert(response.data.message);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog. Check console for details.");
      }
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="blog-container">
      <h2>My Blogs</h2>
      <input
        type="text"
        placeholder="Search Blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {currentBlogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="blog-grid">
          {currentBlogs.map((blog) => (
            <div
              className={`blog-card ${searchTerm ? "searched-blog" : ""}`}
              key={blog._id}
            >
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
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredBlogs.length / blogsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyBlogs;
