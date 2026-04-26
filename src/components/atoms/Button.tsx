"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "amber" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  amber: "btn-amber",
  ghost: "btn-ghost",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`btn ${variantMap[variant]} ${sizeMap[size]} focus-ring ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
