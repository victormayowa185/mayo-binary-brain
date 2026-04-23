import { useNavigate } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import MatrixBackground from "../components/MatrixBackground";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <MatrixBackground />
      <header className="home-header">
        <h1>Welcome to Number Guess AI</h1>
      </header>
      <section className="home-description">
        <p>
          A minimalist AI experiment exploring binary search efficiency.
          <br />
          Think of a number. Let the algorithm find it in 7 tries or less.
        </p>
      </section>
      <div className="home-divider" />
      <section className="home-actions">
        <button
          className="home-btn home-btn-ai"
          onClick={() => navigate("/select/ai")}
        >
          <RiRobot2Line /> AI Guesses Your Number
        </button>
        <button
          className="home-btn home-btn-player"
          onClick={() => navigate("/select/player")}
        >
          <CgProfile /> You Guess the AI's Number
        </button>
      </section>
    </div>
  );
};

export default Home;
