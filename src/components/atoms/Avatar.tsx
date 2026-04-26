"use client";

import React from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  fallback?: string;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

export function Avatar({
  src,
  alt = "User",
  size = "md",
  fallback,
  className = "",
}: AvatarProps) {
  const initials =
    fallback ||
    alt
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white shadow-soft ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-moss-400 to-moss-600 text-white flex items-center justify-center font-semibold ring-2 ring-white shadow-soft ${className}`}
      role="img"
      aria-label={alt}
    >
      {initials}
    </div>
  );
}
