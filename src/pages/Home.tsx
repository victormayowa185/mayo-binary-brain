import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import gsap from "gsap";
import MatrixBackground from "../components/MatrixBackground";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const letterIRef = useRef<HTMLSpanElement>(null);
  const robotIconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const letterI = letterIRef.current;
    const robotIcon = robotIconRef.current;
    if (!letterI || !robotIcon) return;

    // Set initial states
    gsap.set(robotIcon, { opacity: 0, scale: 0, rotation: 0 });
    gsap.set(letterI, { transformOrigin: "center center" });

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 4, // Pause between repeats (now 4 seconds)
    });

    tl
      // Step 1: Stretch the "i" and change colour
      .to(letterI, {
        scaleY: 2.2,
        color: "#5c7bff",
        duration: 0.6,
        ease: "back.out(1.7)",
      })
      // Robot appears & spins (starts 0.2s before stretch finishes)
      .to(
        robotIcon,
        {
          opacity: 1,
          scale: 1.3,
          rotation: 360,
          duration: 0.9,
          ease: "power2.out",
        },
        "-=0.2",
      )
      // Step 2: Return the "i" to normal while shaking
      .to(letterI, {
        scaleY: 1,
        color: "#000000",
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
        keyframes: {
          x: [0, -4, 4, -3, 3, 0],
        },
      })
      // Robot fades out quickly (starts 0.1s before "i" finishes returning)
      .to(
        robotIcon,
        {
          opacity: 0,
          scale: 0,
          rotation: 0,
          duration: 0.6, // Quick exit (was 5.3, now 0.6)
          ease: "power2.in",
        },
        "-=0.1",
      );
  }, []);

  return (
    <div className="home-container">
      <MatrixBackground />
      <header className="home-header">
        <h1>
          Welcome to a Number Guess
          <span className="animated-i" ref={letterIRef}>
            i
          </span>
          ng <span className="ai">AI</span>
          {/* Robot icon placed relative to the heading */}
          <span className="robot-icon" ref={robotIconRef}>
            <FaRobot />
          </span>
        </h1>
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
