import { useRef, useEffect } from "react";
import gsap from "gsap";

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getRandomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 220;
    canvas.height = 220;

    const fontSize = 38;
    ctx.font = `${fontSize}px 'Mulish', monospace`;

    const totalFloats = 8;
    const centerX = canvas.width - 65;
    const centerY = 65;

    const floats: {
      baseX: number;
      baseY: number;
      offsetY: number;
      offsetX: number;
      speedY: number;
      speedX: number;
      directionY: number;
      directionX: number;
      value: number;
    }[] = [];

    for (let i = 0; i < totalFloats; i++) {
      const angle =
        (i / totalFloats) * Math.PI * 2 + (Math.random() - 0.5) * 1.5;
      const radius = 30 + Math.random() * 65;
      const jitterX = (Math.random() - 0.5) * 20;
      const jitterY = (Math.random() - 0.5) * 20;

      floats.push({
        baseX: centerX + Math.cos(angle) * radius + jitterX,
        baseY: centerY + Math.sin(angle) * radius + jitterY,
        offsetX: (Math.random() - 0.5) * 10,
        offsetY: (Math.random() - 0.5) * 10,
        speedX: 0.1 + Math.random() * 0.25,
        speedY: 0.15 + Math.random() * 0.35,
        directionX: Math.random() > 0.5 ? 1 : -1,
        directionY: Math.random() > 0.5 ? 1 : -1,
        value: getRandomNumber(1, 99),
      });
    }

    const tl = gsap.timeline({
      repeat: -1,
      onUpdate: () => {
        // Check both html and body for the dark class
        const isDark =
          document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isDark
          ? "rgba(255, 255, 255, 0.22)" // white in dark mode
          : "rgba(100, 100, 100, 0.21)"; // dim grey in light mode
        ctx.font = `${fontSize}px 'Mulish', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        floats.forEach((f) => {
          f.offsetX += f.speedX * f.directionX;
          f.offsetY += f.speedY * f.directionY;

          if (Math.abs(f.offsetX) > 15) f.directionX *= -1;
          if (Math.abs(f.offsetY) > 15) f.directionY *= -1;

          const x = f.baseX + f.offsetX;
          const y = f.baseY + f.offsetY;

          if (Math.random() < 0.002) {
            f.value = getRandomNumber(1, 99);
          }

          ctx.fillText(f.value.toString(), x, y);
        });
      },
    });

    tl.to({}, { duration: 0.1 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: "100px",
        right: "80px",
        width: "220px",
        height: "220px",
        zIndex: 1, // sits above the background
        pointerEvents: "none",
      }}
    />
  );
};

export default MatrixBackground;
