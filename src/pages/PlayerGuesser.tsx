import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaRedo, FaCog } from "react-icons/fa";
import "../styles/PlayerGuesser.css";

const PlayerGuesser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { min: initialMin = 10, max: initialMax = 100 } = location.state || {};

  const [secret, setSecret] = useState(
    () =>
      Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin,
  );
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Enter your first guess");
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState<{ guess: number; result: string }[]>(
    [],
  );
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    if (started) return;
    setStarted(true);
    startRef.current = Date.now();
    timerRef.current = setInterval(
      () => setTimer(Math.floor((Date.now() - startRef.current) / 1000)),
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
    setStarted(false);
  };

  const handleGuess = () => {
    if (gameOver) return;
    const guess = parseInt(input, 10);
    if (isNaN(guess) || guess < initialMin || guess > initialMax) {
      setFeedback(
        `Please enter a number between ${initialMin} and ${initialMax}.`,
      );
      return;
    }
    startTimer();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    let result = "";
    if (guess === secret) {
      result = "Correct! 🎉";
      setFeedback(
        `🎉 Congratulations! You found it in ${newAttempts} attempts.`,
      );
      setGameOver(true);
      stopTimer();
    } else if (guess < secret) {
      result = "Too low 📉";
      setFeedback("Too low. Try a higher number.");
    } else {
      result = "Too high 📈";
      setFeedback("Too high. Try a lower number.");
    }
    setHistory((prev) => [{ guess, result }, ...prev]);
    setInput("");
    if (!gameOver) inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGuess();
  };

  const handleNewGame = () => {
    setSecret(
      Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin,
    );
    setAttempts(0);
    setFeedback("Enter your first guess");
    setGameOver(false);
    setHistory([]);
    setInput("");
    resetTimer();
    inputRef.current?.focus();
  };

  return (
    <div className="player-guesser-container">
      <div className="player-guesser-card">
        <h1 className="player-title">You Guess the AI's Number</h1>
        <div className="range-display">
          Range: {initialMin} – {initialMax}
        </div>
        {gameOver && (
          <div className="secret-reveal">
            The number was: <span>{secret}</span>
          </div>
        )}
        <div className={`feedback-box ${gameOver ? "success" : ""}`}>
          {feedback}
        </div>
        {!gameOver && (
          <div className="guess-input-area">
            <input
              ref={inputRef}
              type="number"
              min={initialMin}
              max={initialMax}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="guess-input"
              autoFocus
            />
            <button className="guess-submit-btn" onClick={handleGuess}>
              <FaArrowRight />
            </button>
          </div>
        )}
        <div className="stats">
          <span>Attempts: {attempts}</span>
          <span>Time: {timer}s</span>
        </div>
        {history.length > 0 && (
          <div className="history-box">
            <h3>Recent Guesses</h3>
            <div className="history-list">
              {history.slice(0, 5).map((item, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-guess">{item.guess}</span>
                  <span className="history-result">{item.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="action-buttons">
          {gameOver && (
            <button className="primary-btn" onClick={handleNewGame}>
              <FaRedo /> New Number
            </button>
          )}
          <button
            className="outline-btn"
            onClick={() => navigate("/select/player")}
          >
            <FaCog /> Change Range
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerGuesser;
