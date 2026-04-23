import { FaGithub } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        A <span className="brand-mayo">MAYO</span> project by{" "}
        <span className="brand-name">Victor Mayowa</span>
      </p>
      <a
        href="https://github.com/victormayowa185"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label="GitHub"
      >
        <FaGithub size={24} />
      </a>
    </footer>
  );
};

export default Footer;
