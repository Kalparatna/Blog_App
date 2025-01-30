import { Link } from "react-router-dom";
import "../assets/styles/Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/my-blogs">My Blogs</Link>
        </li>
        <li>
          <Link to="/add-blog">Add Blog</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;