import { Link } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => (
  <div className="notfound-container">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <Link to="/">← Back to Home</Link>
  </div>
);
export default NotFound;
