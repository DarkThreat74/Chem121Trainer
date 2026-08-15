"use client";

import { useEffect, useState } from "react";

const COLORS = ["#34d399", "#818cf8", "#fbbf24", "#f0abfc", "#60a5fa", "#fb923c"];

export default function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number; duration: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: trigger * 100 + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
