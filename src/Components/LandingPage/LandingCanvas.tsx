// src/components/LandingCanvas.tsx
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  radius: number;
  vx: number;
  vy: number;
}

const LandingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let particles: Particle[] = [];

    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 🔥 INCREASED particle density
      const count = Math.min(
        Math.floor((rect.width * rect.height) / 1500), // was 9000
        900 // hard cap for performance
      );

      particles = Array.from({ length: count }, () => {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;

        return {
          x,
          y,
          ox: x,
          oy: y,
          radius: Math.random() * 2 + 1.2,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        };
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Base floating motion
        p.ox += p.vx;
        p.oy += p.vy;

        if (p.ox < 0 || p.ox > canvas.width) p.vx *= -1;
        if (p.oy < 0 || p.oy > canvas.height) p.vy *= -1;

        let tx = p.ox;
        let ty = p.oy;

        let ease = 1.9; // normal speed

        if (!isTouch) {
          const dx = mouse.current.x - p.ox;
          const dy = mouse.current.y - p.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const influence = 320; // larger interaction radius

          if (dist < influence) {
            const force = (influence - dist) / influence;

            // ⚡ STRONGER & FASTER repulsion
            tx -= dx * force * 0.35;
            ty -= dy * force * 0.35;

            ease = 1.18; // 🔥 faster animation on hover
          }
        }

        // Smooth easing
        p.x += (tx - p.x) * ease;
        p.y += (ty - p.y) * ease;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(108, 203, 133, 0.85)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    if (!isTouch) window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
    />
  );
};

export default LandingCanvas;
