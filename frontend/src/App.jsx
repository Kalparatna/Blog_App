import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MyBlogs from "./components/MyBlogs";
import AddBlog from "./components/AddBlog";
import UpdateBlog from "./components/UpdateBlog";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<MyBlogs />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/update-blog/:id" element={<UpdateBlog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;