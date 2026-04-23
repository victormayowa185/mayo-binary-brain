import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RangePicker from "./pages/RangePicker";
import AIGuesser from "./pages/AIGuesser";
import PlayerGuesser from "./pages/PlayerGuesser";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import "./App.css"; // We'll create this

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/select/:mode" element={<RangePicker />} />
            <Route path="/ai-guesses" element={<AIGuesser />} />
            <Route path="/player-guesses" element={<PlayerGuesser />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
