"use client";

import React, { useEffect, useState } from "react";

interface ConfettiEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ isActive, onComplete }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      delay: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: [
          "#dc1c2e",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
        ][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 0.5,
      }));

      setParticles(newParticles);

      // Clear particles and call onComplete after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}
