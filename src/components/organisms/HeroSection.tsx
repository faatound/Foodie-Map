"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import { SearchBar } from "@/components/molecules/SearchBar";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-[10%] w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] animate-float" />
      <div className="absolute bottom-32 right-[8%] w-80 h-80 rounded-full bg-moss-400/15 blur-[100px] animate-float [animation-delay:2s]" />
      <div className="absolute top-[40%] right-[25%] w-64 h-64 rounded-full bg-rust-400/8 blur-[80px] animate-pulse-slow" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-noise pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-xl text-center px-4">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-white/90 text-sm font-medium mb-8"
        >
          <Sparkles size={14} className="text-amber-300" />
          Découvertes gourmandes par la communauté
        </motion.div>

        {/* Heading */}
        <h1 className="font-display font-bold text-white max-w-4xl mx-auto leading-[1.08] tracking-tight">
          <span className="hero-text-reveal block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Votre Boussole
          </span>
          <span className="hero-text-reveal-2 block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-1">
            Culinaire
          </span>
          <span className="hero-text-reveal-3 block text-lg sm:text-xl md:text-2xl font-normal text-white/70 mt-4 max-w-2xl mx-auto leading-relaxed">
            Découvrez, partagez et savourez les meilleures adresses du monde.
            Explorez des restaurants triés sur le volet et des trésors cachés.
          </span>
        </h1>

        {/* Search bar */}
        <div className="mt-10 flex justify-center hero-text-reveal-4">
          <SearchBar variant="hero" />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 sm:gap-12 text-white/60 text-sm"
        >
          {[
            { value: "2,400+", label: "Lieux" },
            { value: "850+", label: "Gourmets" },
            { value: "12K+", label: "Photos" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-white font-display font-bold text-xl sm:text-2xl">
                {stat.value}
              </div>
              <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-wider uppercase">Faites défiler</span>
          <ArrowDown size={16} />
        </div>
      </motion.div>
    </section>
  );
}
