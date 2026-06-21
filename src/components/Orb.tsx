'use client';
import React from 'react';

interface OrbProps {
  color?: string;
  size?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function Orb({
  color = 'rgba(15, 110, 86, 0.08)',
  size = '400px',
  top,
  left,
  right,
  bottom,
  opacity = 0.08,
  className = '',
  style,
  ...props
}: OrbProps) {
  return (
    <div
      className={`ambient-orb ${className}`}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        opacity,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
      {...props}
    />
  );
}
