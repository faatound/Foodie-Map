"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Heart, Star } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { CATEGORIES } from "@/types";
import type { Location } from "@/types";
import { useStore } from "@/store/useStore";

interface LocationCardProps {
  location: Location;
  index?: number;
  variant?: "default" | "compact";
}

export function LocationCard({
  location,
  index = 0,
  variant = "default",
}: LocationCardProps) {
  const { toggleSaved, isSaved } = useStore();
  const saved = isSaved(location.id);
  const cat = CATEGORIES.find((c) => c.slug === location.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <Link
        href={`/locations/${location.id}`}
        className="group block card-base overflow-hidden focus-ring"
        id={`location-${location.id}`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={location.hero_image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70"}
            alt={location.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Save button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(location.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label={saved ? "Retirer des favoris" : "Enregistrer le lieu"}
          >
            <Heart
              size={16}
              className={`transition-colors ${
                saved ? "fill-red-500 text-red-500" : "text-stone-600"
              }`}
            />
          </button>

          {/* Category badge */}
          {cat && (
            <div className="absolute top-3 left-3">
              <Badge color={cat.color} variant="solid" className="text-[11px]">
                {cat.emoji} {cat.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-bold text-stone-900 text-lg tracking-tight group-hover:text-moss-500 transition-colors">
            {location.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5 text-stone-500 text-sm">
            <MapPin size={13} className="text-stone-400 flex-shrink-0" />
            <span className="truncate">{location.address}</span>
          </div>

          {location.description && variant === "default" && (
            <p className="mt-2.5 text-sm text-stone-500 line-clamp-2 leading-relaxed">
              {location.description}
            </p>
          )}

          {/* Rating */}
          {location.avg_rating && location.avg_rating > 0 && (
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-stone-700">
                {location.avg_rating.toFixed(1)}
              </span>
              <span className="text-stone-400">/ 5</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
