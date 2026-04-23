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

    const resizeCanvas = () => {
      canvas.width = 160;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 32;
    ctx.font = `${fontSize}px 'Mulish', monospace`;
    ctx.fillStyle = "rgba(140, 140, 140, 0.85)";

    const rows = 12;
    const rowHeight = canvas.height / rows;
    const columns = 3;
    const columnWidth = canvas.width / columns;

    const floats: {
      baseY: number;
      offset: number;
      speed: number;
      direction: number;
      value: number;
      x: number;
    }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        floats.push({
          baseY: r * rowHeight + rowHeight * 0.5,
          offset: Math.random() * 20 - 10,
          speed: 0.2 + Math.random() * 0.5,
          direction: Math.random() > 0.5 ? 1 : -1,
          value: getRandomNumber(1, 99),
          x: c * columnWidth + columnWidth * 0.5,
        });
      }
    }

    const tl = gsap.timeline({
      repeat: -1,
      onUpdate: () => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(140, 140, 140, 0.85)";
        ctx.font = `${fontSize}px 'Mulish', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        floats.forEach((f) => {
          f.offset += f.speed * f.direction;
          if (Math.abs(f.offset) > 15) f.direction *= -1;
          const y = f.baseY + f.offset;
          if (Math.random() < 0.005) f.value = getRandomNumber(1, 99);
          ctx.fillText(f.value.toString(), f.x, y);
        });
      },
    });

    tl.to({}, { duration: 0.1 });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      tl.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "160px",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default MatrixBackground;
