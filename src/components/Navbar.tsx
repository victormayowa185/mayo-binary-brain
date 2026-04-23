import { Link } from "react-router-dom";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => (
  <nav className="navbar">
    <Link to="/" className="navbar-logo">
      MAYO<span className="logo-dot">.</span>
    </Link>

    <div className="navbar-left">
      <Link to="/contact" className="navbar-icon">
        <FaEnvelope size={22} />
      </Link>
      <a
        href="https://victormayowa.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="navbar-icon"
      >
        <FaUserCircle size={24} />
      </a>
    </div>
  </nav>
);
export default Navbar;
