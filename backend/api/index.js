// api/index.js (Vercel serverless function entry point)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Blog = require('./models/Blog');
require('dotenv').config();

// Initialize the Express app
const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type"] }));

app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'blog_images', format: async () => 'png' },
});
const upload = multer({ storage: storage });

// Define routes
app.post('/add-blog', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const blog = new Blog({ title, description, image: imageUrl });
    await blog.save();
    res.json({ success: true, message: 'Blog added successfully!' });
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/my-blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/update-blog/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, image: imageUrl || undefined },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete-blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the app as a Vercel serverless function
module.exports = app;
