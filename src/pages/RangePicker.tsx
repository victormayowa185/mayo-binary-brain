import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import "../styles/RangePicker.css";

const RangePicker = () => {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  const [min, setMin] = useState(10);
  const [max, setMax] = useState(100);

  // Derived error message – no state, no effect
  const error =
    min < 10
      ? "Minimum must be at least 10."
      : max > 100
        ? "Maximum cannot exceed 100."
        : min >= max
          ? "Minimum must be less than maximum."
          : "";

  const handleStart = () => {
    if (error) return;
    const destination = mode === "ai" ? "/ai-guesses" : "/player-guesses";
    navigate(destination, { state: { min, max } });
  };

  const modeDescription =
    mode === "ai"
      ? "Think of a number between your chosen range. The AI will guess it using binary search."
      : "The AI will pick a secret number. You’ll guess until you find it.";

  return (
    <div className="range-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back
      </button>
      <div className="range-card">
        <h1 className="range-title">
          {mode === "ai" ? (
            <>
              <span className="ai">AI</span> Guesses
            </>
          ) : (
            "You Guess"
          )}
        </h1>
        <p className="range-description">{modeDescription}</p>
        <div className="range-divider" />
        <div className="range-inputs">
          <div className="input-group">
            <label htmlFor="min">Minimum</label>
            <input
              id="min"
              type="number"
              value={min}
              onChange={(e) => setMin(+e.target.value)}
              min={10}
              max={100}
              className="range-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="max">Maximum</label>
            <input
              id="max"
              type="number"
              value={max}
              onChange={(e) => setMax(+e.target.value)}
              min={10}
              max={100}
              className="range-input"
            />
          </div>
        </div>
        {error && <p className="range-error">{error}</p>}
        <button className="start-btn" onClick={handleStart} disabled={!!error}>
          <FaPlay /> Start Game
        </button>
      </div>
    </div>
  );
};

export default RangePicker;
