import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlay, FaRedo, FaCog } from "react-icons/fa";
import "../styles/AIGuesser.css";

const AIGuesser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { min: initialMin = 10, max: initialMax = 100 } = location.state || {};

  const initialTarget =
    Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin;

  const targetRef = useRef(initialTarget); // always holds the real target
  const [targetInput, setTargetInput] = useState(initialTarget.toString());
  const [guess, setGuess] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState("Click Start to begin");
  const [log, setLog] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const currentStepRef = useRef({ low: initialMin, high: initialMax });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTimer = () => {
    startTimeRef.current = Date.now() - timer * 1000;
    timerRef.current = setInterval(
      () => setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000)),
      100,
    );
  };
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const resetTimer = () => {
    stopTimer();
    setTimer(0);
  };

  const performStep = (low: number, high: number) => {
    const currentTarget = targetRef.current; // always fresh

    if (low > high) {
      setMessage("Error: number not found.");
      setIsRunning(false);
      setIsComplete(true);
      stopTimer();
      return;
    }
    const mid = Math.floor((low + high) / 2);
    setGuess(mid);
    setAttempts((a) => a + 1);

    if (mid === currentTarget) {
      setMessage(`Found it! The number was ${currentTarget}.`);
      setLog((l) => [...l, `Guess: ${mid} → Correct! 🎉`]);
      setIsRunning(false);
      setIsComplete(true);
      stopTimer();
      return;
    }

    if (mid < currentTarget) {
      setLog((l) => [
        ...l,
        `Guess: ${mid} → Too low, new range: ${mid + 1} – ${high}`,
      ]);
      currentStepRef.current = { low: mid + 1, high };
    } else {
      setLog((l) => [
        ...l,
        `Guess: ${mid} → Too high, new range: ${low} – ${mid - 1}`,
      ]);
      currentStepRef.current = { low, high: mid - 1 };
    }

    timeoutRef.current = setTimeout(
      () =>
        performStep(currentStepRef.current.low, currentStepRef.current.high),
      800,
    );
  };

  const handleStart = () => {
    const num = parseInt(targetInput, 10);
    if (isNaN(num) || num < initialMin || num > initialMax) {
      setMessage(
        `Please enter a number between ${initialMin} and ${initialMax}.`,
      );
      return;
    }
    setTarget(num);
    targetRef.current = num;
    setAttempts(0);
    setLog([]);
    setIsComplete(false);
    setMessage(`Searching for ${num}...`);
    resetTimer();
    startTimer();
    currentStepRef.current = { low: initialMin, high: initialMax };
    setIsRunning(true);
    timeoutRef.current = setTimeout(
      () => performStep(initialMin, initialMax),
      500,
    );
  };

  const handleRandomize = () => {
    const newTarget =
      Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin;
    setTarget(newTarget);
    targetRef.current = newTarget;
    setTargetInput(newTarget.toString());
    setMessage(`Target set to ${newTarget}. Click Start.`);
    setGuess(null);
    setAttempts(0);
    setLog([]);
    setIsComplete(false);
    setIsRunning(false);
    resetTimer();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Handle manual input changes – update the message when a valid number is typed
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTargetInput(raw);

    if (raw.trim() === "") {
      setMessage("Click Start to begin");
      return;
    }

    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= initialMin && num <= initialMax) {
      setMessage(`Target set to ${num}. Click Start.`);
    } else {
      // Keep the previous message – don't overwrite with an error yet
    }
  };

  return (
    <div className="ai-guesser-container">
      <div className="ai-guesser-card">
        <h1 className="ai-title">
          <span className="ai">AI</span> Guesser (Binary Search)
        </h1>
        <div className="range-display">
          Range: {initialMin} – {initialMax}
        </div>
        <div className="target-section">
          <label htmlFor="targetInput">Secret Number:</label>
          <div className="target-input-group">
            <input
              id="targetInput"
              type="number"
              min={initialMin}
              max={initialMax}
              value={targetInput}
              onChange={handleInputChange}
              disabled={isRunning}
              className="target-input"
            />
            <button
              onClick={handleRandomize}
              disabled={isRunning}
              className="randomize-btn"
            >
              <FaRedo />
            </button>
          </div>
        </div>
        <div className="guess-section">
          <div className="guess-label">Current Guess</div>
          <div className="guess-number">{guess !== null ? guess : "—"}</div>
        </div>
        <div className="message-box">{message}</div>
        {log.length > 0 && (
          <div className="log-box">
            {log.map((entry, idx) => (
              <div key={idx} className="log-entry">
                {entry}
              </div>
            ))}
          </div>
        )}
        <div className="stats">
          <span>Attempts: {attempts}</span>
          <span>Time: {timer}s</span>
        </div>
        <div className="action-buttons">
          {!isRunning && !isComplete && (
            <button className="primary-btn" onClick={handleStart}>
              <FaPlay /> Start
            </button>
          )}
          {isComplete && (
            <button className="secondary-btn" onClick={handleRandomize}>
              <FaRedo /> New Number
            </button>
          )}
          <button
            className="outline-btn"
            onClick={() => navigate("/select/ai")}
          >
            <FaCog /> Change Range
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGuesser;
