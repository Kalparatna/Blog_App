import { useState } from "react";
import axios from "axios";
import "../assets/styles/AddBlog.css";


const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post("blog-app-backend-indol-pi.vercel.app/add-blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      // Reset form fields
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Failed to add blog. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Add Blog</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit">Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;
