"use client";

import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <button
            key={i}
            type="button"
            className={`${
              interactive
                ? "cursor-pointer hover:scale-125 transition-transform"
                : "cursor-default pointer-events-none"
            } focus-ring`}
            onClick={() => interactive && onChange?.(i + 1)}
            aria-label={`${i + 1} star${i !== 0 ? "s" : ""}`}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? i + 1 === Math.round(rating) : undefined}
            tabIndex={interactive ? 0 : -1}
          >
            <Star
              size={size}
              className={`transition-colors ${
                filled
                  ? "text-amber-400 fill-amber-400"
                  : partial
                  ? "text-amber-400 fill-amber-200"
                  : "text-stone-300"
              }`}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="text-sm font-medium text-stone-600 ml-1.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
