import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/UpdateBlog.css";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`https://blog-app-backend-indol-pi.vercel.app/blog/${id}`);
        formik.setValues({
          title: res.data.title,
          description: res.data.description,
          image: null, // Keep image null initially
        });
        setCurrentImage(res.data.image);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      image: Yup.mixed()
        .nullable()
        .notRequired()
        .test("fileSize", "Image must be less than 2MB", (file) => {
          return !file || (file && file.size <= 2 * 1024 * 1024);
        })
        .test("fileType", "Only JPG/PNG images are allowed", (file) => {
          return !file || (file && ["image/jpeg", "image/png"].includes(file.type));
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        const response = await axios.put(`https://blog-app-backend-indol-pi.vercel.app/update-blog/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(response.data.message);
        navigate("/my-blogs");
      } catch (error) {
        console.error("Error updating blog:", error);
        alert("Failed to update blog. Check console for details.");
      }
    },
  });

  return (
    <div className="update-blog-container">
      <h2>Update Blog</h2>
      <form onSubmit={formik.handleSubmit} className="update-blog-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.errors.title && <p className="error-text">{formik.errors.title}</p>}

        <textarea
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        {formik.errors.description && <p className="error-text">{formik.errors.description}</p>}

        <div className="image-preview">
          {currentImage && <img src={currentImage} alt="Current" className="preview-image" />}
        </div>

        <input
          type="file"
          name="image"
          onChange={(event) => {
            const file = event.target.files[0];
            formik.setFieldValue("image", file);
          }}
        />
        {formik.errors.image && <p className="error-text">{formik.errors.image}</p>}

        <button type="submit">Update Blog</button>
      </form>
    </div>
  );
};

export default UpdateBlog;
