'use client';
import React, { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(0, 128, 110, 0.10)",
  style,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`spotlight-card ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style
      }}
      {...props}
    >
      <div
        className="spotlight-card-effect"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: isFocused ? 1 : 0,
          transition: "opacity 0.4s ease",
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, height: "100%", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
