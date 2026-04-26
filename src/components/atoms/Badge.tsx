"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: "solid" | "soft" | "outline";
  className?: string;
}

export function Badge({
  children,
  color = "#2d5a29",
  variant = "soft",
  className = "",
}: BadgeProps) {
  const styles: Record<string, React.CSSProperties> = {
    solid: {
      backgroundColor: color,
      color: "white",
    },
    soft: {
      backgroundColor: `${color}14`,
      color: color,
    },
    outline: {
      backgroundColor: "transparent",
      border: `1px solid ${color}40`,
      color: color,
    },
  };

  return (
    <span className={`badge-pill ${className}`} style={styles[variant]}>
      {children}
    </span>
  );
}
