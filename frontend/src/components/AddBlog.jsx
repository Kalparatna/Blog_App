import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../assets/styles/AddBlog.css";

const AddBlog = () => {
  const [imagePreview, setImagePreview] = useState(null);

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
        .required("Image is required")
        .test("fileSize", "Image must be less than 2MB", (file) => {
          return file && file.size <= 2 * 1024 * 1024;
        })
        .test("fileType", "Only JPG/PNG images are allowed", (file) => {
          return file && ["image/jpeg", "image/png"].includes(file.type);
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("image", values.image);

      try {
        const response = await axios.post("https://blog-app-backend-indol-pi.vercel.app/add-blog", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert(response.data.message);
        resetForm();
        setImagePreview(null);
      } catch (error) {
        console.error("Error adding blog:", error);
        alert("Failed to add blog. Check console for details.");
      }
    },
  });

  return (
    <div>
      <h2>Add Blog</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.errors.title && <p style={{ color: "red" }}>{formik.errors.title}</p>}

        <textarea
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        {formik.errors.description && <p style={{ color: "red" }}>{formik.errors.description}</p>}

        <input
          type="file"
          name="image"
          onChange={(event) => {
            const file = event.target.files[0];
            formik.setFieldValue("image", file);
            setImagePreview(URL.createObjectURL(file));
          }}
        />
        {formik.errors.image && <p style={{ color: "red" }}>{formik.errors.image}</p>}

        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "200px" }} />}
        
        <button type="submit">Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;
