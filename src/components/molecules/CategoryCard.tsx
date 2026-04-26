"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="group block relative overflow-hidden rounded-3xl aspect-[4/5] card-base !border-0 !shadow-card focus-ring"
        id={`category-${category.slug}`}
      >
        {/* Background Image */}
        <Image
          src={category.image}
          alt={category.label}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        {/* Glassmorphism pill */}
        <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-medium text-stone-800 flex items-center gap-1.5">
          <span className="text-sm">{category.emoji}</span>
          <span>{category.label}</span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-xl font-bold font-display mb-1.5 tracking-tight">
            {category.label}
          </h3>
          <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
            {category.description}
          </p>

          {/* Hover arrow */}
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-300 opacity-0 translate-x-[-8px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            Explore
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Hover glow ring */}
        <div className="absolute inset-0 rounded-3xl ring-2 ring-white/0 group-hover:ring-white/20 transition-all duration-500" />
      </Link>
    </motion.div>
  );
}
