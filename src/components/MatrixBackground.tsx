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
      const container = canvas.parentElement;
      if (container) {
        canvas.width = 500;
        canvas.height = container.clientHeight;
      } else {
        canvas.width = 500;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 48;
    ctx.font = `${fontSize}px 'Mulish', monospace`;

    // ----- generate positions in a distorted circle / organic cluster -----
    const totalFloats = 20; // adjust for desired density
    const centerX = canvas.width * 0.5; // 80px (mid‑width)
    const centerY = canvas.height * 0.5; // vertically centered

    const floats: {
      baseX: number; // fixed X position (now part of the cluster)
      baseY: number; // fixed Y position
      offsetY: number; // bobbing vertical offset
      offsetX: number; // subtle horizontal drift (adds to organic feel)
      speedY: number;
      speedX: number;
      directionY: number;
      directionX: number;
      value: number;
    }[] = [];

    for (let i = 0; i < totalFloats; i++) {
      // Distribute angles somewhat evenly, then perturb
      const angle =
        (i / totalFloats) * Math.PI * 2 + (Math.random() - 0.5) * 1.2;
      // Radius: vary between 30 and 80 pixels from center
      const radius = 35 + Math.random() * 50;
      // Add extra random offset in cartesian space to distort the circle
      const jitterX = (Math.random() - 0.5) * 30;
      const jitterY = (Math.random() - 0.5) * 30;

      const baseX = centerX + Math.cos(angle) * radius + jitterX;
      const baseY = centerY + Math.sin(angle) * radius + jitterY;

      floats.push({
        baseX,
        baseY,
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
        // clear without blur
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(100, 100, 100, 0.07)"; // darker grey with more opacity
        ctx.font = `${fontSize}px 'Mulish', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        floats.forEach((f) => {
          // bobbing / drifting motion
          f.offsetX += f.speedX * f.directionX;
          f.offsetY += f.speedY * f.directionY;

          // reverse direction when offset gets too large (gives gentle wandering)
          if (Math.abs(f.offsetX) > 18) f.directionX *= -1;
          if (Math.abs(f.offsetY) > 18) f.directionY *= -1;

          const x = f.baseX + f.offsetX;
          const y = f.baseY + f.offsetY;

          // occasionally update the number
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
        top: 40,
        left: "120px",
        width: "500px",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default MatrixBackground;
