"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "hero" | "compact";
}

export function SearchBar({
  onSearch,
  placeholder = "Rechercher des restaurants, cuisines, villes…",
  className = "",
  variant = "hero",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch?.(query.trim());
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-base pl-9 pr-4 py-2 text-sm focus-ring"
          aria-label="Search locations"
        />
      </form>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-2xl ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div
        className={`
          relative flex items-center rounded-2xl overflow-hidden transition-all duration-300
          ${
            focused
              ? "shadow-[0_0_0_3px_rgba(74,124,68,0.18),0_8px_40px_rgba(0,0,0,0.12)]"
              : "shadow-card"
          }
        `}
      >
        <div className="absolute left-5 text-stone-400 pointer-events-none">
          <Search size={20} />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-white border-none outline-none py-4 pl-14 pr-36 text-base text-stone-800 placeholder:text-stone-400"
          aria-label="Search locations"
          id="hero-search"
        />
        <button
          type="submit"
          className="absolute right-2 btn btn-primary btn-sm flex items-center gap-2 !rounded-xl"
        >
          <MapPin size={15} />
          <span className="hidden sm:inline">Explorer</span>
        </button>
      </div>
    </motion.form>
  );
}
