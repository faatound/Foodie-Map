"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-stone-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`input-base focus-ring ${icon ? "pl-11" : ""} ${
            error ? "!border-red-400 !shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : ""
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 mt-0.5" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-stone-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}
