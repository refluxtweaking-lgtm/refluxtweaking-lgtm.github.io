"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
}

function canUseParticles() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if ((navigator.hardwareConcurrency ?? 4) < 4) return false;
  if (window.matchMedia("(max-width: 768px)").matches) return false;
  return true;
}

export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok = canUseParticles();
    if (!ok) {
      document.documentElement.classList.add("reduce-effects");
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let running = true;
    const particles: Particle[] = [];
    const count = 40;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < count; i++) {
      const isAccent = Math.random() > 0.75;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.9 + 0.25,
        color: isAccent
          ? `rgba(241, ${Math.floor(Math.random() * 40 + 70)}, ${Math.floor(Math.random() * 30 + 60)}, ${Math.random() * 0.4 + 0.15})`
          : `rgba(${Math.floor(Math.random() * 80 + 140)},${Math.floor(Math.random() * 50 + 40)},${Math.floor(Math.random() * 30 + 10)},${Math.random() * 0.25 + 0.1})`,
      });
    }

    const drawParticles = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.y += particle.speed;
        if (particle.y > canvas.height + 10) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        cancelAnimationFrame(animationId);
        drawParticles();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    drawParticles();

    return () => {
      running = false;
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas pointer-events-none fixed inset-0 -z-10 opacity-70"
      aria-hidden="true"
    />
  );
}
