import { useEffect, useRef } from "react";

const COLORS = [
  "#E8D5D5", "#C8A4A4", "#F9D6D6", "#FFF0F0",
  "#B08080", "#D4A5A5", "#FFE4E4", "#F5C6C6",
  "#FADADD", "#F7CAC9",
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Confetti() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles
    const count = Math.min(180, Math.floor(window.innerWidth / 6));
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x:       randomBetween(0, canvas.width),
        y:       randomBetween(-canvas.height, 0),
        w:       randomBetween(6, 14),
        h:       randomBetween(3, 7),
        color:   COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha:   randomBetween(0.6, 1),
        vx:      randomBetween(-1.2, 1.2),
        vy:      randomBetween(1.5, 4.5),
        angle:   randomBetween(0, Math.PI * 2),
        spin:    randomBetween(-0.08, 0.08),
        gravity: randomBetween(0.04, 0.1),
        fade:    randomBetween(0.003, 0.008),
      });
    }

    let alive = true;

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => p.alpha > 0);

      for (const p of particles.current) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += p.gravity;
        p.angle += p.spin;
        p.alpha -= p.fade;

        // Wrap horizontally
        if (p.x < -20)              p.x = canvas.width  + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      }

      if (particles.current.length > 0) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      aria-hidden="true"
    />
  );
}
