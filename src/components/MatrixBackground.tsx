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

    // Fixed canvas size – doesn’t depend on the window or container
    canvas.width = 220;
    canvas.height = 220;

    const fontSize = 38; // comfortable fixed size
    ctx.font = `${fontSize}px 'Mulish', monospace`;
    ctx.fillStyle = "rgba(100, 100, 100, 0.07)"; // dim grey

    const totalFloats = 8; // a few more for a nice cluster
    // Cluster origin: top‑right area of the canvas (with margin)
    const centerX = canvas.width - 65; // 65px from right edge
    const centerY = 65; // 65px from top edge

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
      // Keep the radius moderate so the cluster stays within the canvas
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  }, []); // no resize listener needed anymore

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", // stays put even if page scrolls
        top: "100px", // margin from top
        right: "80px", // margin from right
        width: "220px",
        height: "220px",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default MatrixBackground;
