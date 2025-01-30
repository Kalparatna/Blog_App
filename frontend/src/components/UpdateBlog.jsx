import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/UpdateBlog.css";

const UpdateBlog = () => {
  const { id } = useParams(); // To fetch the blog id from URL
  const navigate = useNavigate(); // To navigate after updating
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState(null); // For handling error messages

  // Fetch the blog details based on the ID
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log("Fetching blog with ID:", id); // Log the ID
        const res = await axios.get(`blog-app-backend-indol-pi.vercel.app/blog/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setCurrentImage(res.data.image);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Blog not found or server error.");
      }
    };
    fetchBlog();
  }, [id]);

  // Handle the form submission to update the blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image); // Append the new image if uploaded
    }

    try {
      const response = await axios.put(`blog-app-backend-indol-pi.vercel.app/update-blog/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      navigate("/my-blogs"); // Redirect to "My Blogs" page after update
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Update Blog</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error if any */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div>
          {currentImage && (
            <img
              src={currentImage}
              alt="Current"
              style={{ width: "200px", marginBottom: "10px" }}
            />
          )}
        </div>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Update Blog</button>
      </form>
    </div>
  );
};

export default UpdateBlog;
