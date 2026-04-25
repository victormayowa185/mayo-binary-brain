import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaMoon,
} from "react-icons/fa";
import { MdOutlineLightMode } from "react-icons/md";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // On mount, read the saved theme from localStorage and apply it
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        MAYO<span className="logo-dot">.</span>
      </Link>

      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div className={`navbar-left ${isOpen ? "active" : ""}`}>
        {/* Dark mode toggle added here */}
        <button
          className="navbar-icon theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {isDark ? <MdOutlineLightMode size={22} /> : <FaMoon size={22} />}
        </button>

        <Link to="/contact" className="navbar-icon" onClick={closeMenu}>
          <FaEnvelope size={22} />
        </Link>
        <a
          href="https://victormayowa.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-icon"
          onClick={closeMenu}
        >
          <FaUserCircle size={24} />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
