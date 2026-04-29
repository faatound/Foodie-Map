"use client";

import React from "react";
import { motion } from "framer-motion";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { CATEGORIES } from "@/types";

export function CategoriesGrid() {
  return (
    <section className="py-24 relative overflow-hidden" id="categories">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-glow-moss opacity-30 pointer-events-none" />

      <div className="container-xl relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-moss-500 mb-3">
            Parcourir par type
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 tracking-tight">
            Explorer les Catégories
          </h2>
          <p className="text-stone-500 mt-3 max-w-lg mx-auto text-base leading-relaxed">
            De la cuisine raffinée au street food, trouvez exactement ce dont vous avez envie.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
