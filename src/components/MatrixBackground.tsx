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

    const container = canvas.parentElement!;

    const resizeCanvas = () => {
      // Canvas fills the entire home-container
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Responsive font size
    const fontSizeBase = canvas.width < 480 ? 32 : canvas.width < 768 ? 42 : 48;
    const fontSize = Math.min(56, Math.max(28, fontSizeBase));
    ctx.font = `${fontSize}px 'Mulish', monospace`;

    const totalFloats = 20;
    const centerX = canvas.width * 0.5; // horizontal centre
    const centerY = canvas.height * 0.5; // vertical centre

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
        (i / totalFloats) * Math.PI * 2 + (Math.random() - 0.5) * 1.2;
      const radius = 35 + Math.random() * 50;
      const jitterX = (Math.random() - 0.5) * 30;
      const jitterY = (Math.random() - 0.5) * 30;

      floats.push({
        baseX: centerX + Math.cos(angle) * radius + jitterX,
        baseY: centerY + Math.sin(angle) * radius + jitterY,
        offsetX: (Math.random() - 0.5) * 12,
        offsetY: (Math.random() - 0.5) * 12,
        speedX: 0.1 + Math.random() * 0.3,
        speedY: 0.15 + Math.random() * 0.4,
        directionX: Math.random() > 0.5 ? 1 : -1,
        directionY: Math.random() > 0.5 ? 1 : -1,
        value: getRandomNumber(1, 99),
      });
    }

    const tl = gsap.timeline({
      repeat: -1,
      onUpdate: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(100, 100, 100, 0.07)"; // subtle, dim grey
        ctx.font = `${fontSize}px 'Mulish', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        floats.forEach((f) => {
          f.offsetX += f.speedX * f.directionX;
          f.offsetY += f.speedY * f.directionY;

          if (Math.abs(f.offsetX) > 18) f.directionX *= -1;
          if (Math.abs(f.offsetY) > 18) f.directionY *= -1;

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
      window.removeEventListener("resize", resizeCanvas);
      tl.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default MatrixBackground;
