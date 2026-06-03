"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type Star = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
};

const MIN_STARS = 110;
const MAX_STARS = 260;
const CENTER_THRESHOLD = 38;

function starCount(width: number, height: number): number {
  const scaled = Math.round((width * height) / 12000);
  return Math.min(MAX_STARS, Math.max(MIN_STARS, scaled));
}

function spawnOnEdge(width: number, height: number): { x: number; y: number } {
  const side = Math.floor(Math.random() * 4);
  const pad = 2;

  switch (side) {
    case 0:
      return { x: pad, y: Math.random() * height };
    case 1:
      return { x: width - pad, y: Math.random() * height };
    case 2:
      return { x: Math.random() * width, y: pad };
    default:
      return { x: Math.random() * width, y: height - pad };
  }
}

function createStar(width: number, height: number): Star {
  const { x, y } = spawnOnEdge(width, height);
  return {
    x,
    y,
    radius: Math.random() * 0.7 + 0.75,
    opacity: Math.random() * 0.35 + 0.12,
    speed: Math.random() * 0.35 + 0.35,
  };
}

function createStars(width: number, height: number, count: number): Star[] {
  return Array.from({ length: count }, () => createStar(width, height));
}

function respawnStar(star: Star, width: number, height: number) {
  const { x, y } = spawnOnEdge(width, height);
  star.x = x;
  star.y = y;
  star.radius = Math.random() * 0.7 + 0.75;
  star.opacity = Math.random() * 0.35 + 0.12;
  star.speed = Math.random() * 0.35 + 0.35;
}

export default function HeroNightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(true);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    isDarkRef.current = resolvedTheme !== "light";
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let stars: Star[] = [];
    let animationId = 0;
    let reducedMotion = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = parent;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(clientWidth, clientHeight, starCount(clientWidth, clientHeight));
    };

    const draw = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const isDark = isDarkRef.current;

      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        const dx = cx - star.x;
        const dy = cy - star.y;
        const dist = Math.hypot(dx, dy);

        if (!reducedMotion) {
          if (dist < CENTER_THRESHOLD) {
            respawnStar(star, w, h);
          } else {
            star.x += (dx / dist) * star.speed;
            star.y += (dy / dist) * star.speed;
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        const lightAlpha = Math.min(1, 0.38 + star.opacity * 0.25);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${star.opacity})`
          : `rgba(0, 0, 0, ${lightAlpha})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
        isDark
          ? "bg-[#000104]"
          : "bg-gradient-to-b from-[#dce4f0] via-[#e8eef6] to-[#f0f3f8]"
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
