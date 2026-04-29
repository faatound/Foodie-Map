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
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 flex items-center justify-center">
          {(() => {
            // 1. Vérifie si une image existe dans la DB (plusieurs sources possibles)
            let rawImg = location.image_url || location.hero_image || (location.images && Array.isArray(location.images) && location.images.length > 0 ? location.images[0] : null);

            // Nettoyage de l'URL au cas où il y aurait des guillemets parasites
            if (typeof rawImg === 'string') {
              rawImg = rawImg.trim().replace(/^["']|["']$/g, '');
            }

            // 2. Si pas d'image, affiche un placeholder gris ("Rien")
            if (!rawImg || typeof rawImg !== 'string' || rawImg.length < 5) {
              return (
                <div className="text-center p-4">
                  <MapPin size={24} className="text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-400 font-medium">Pas de photo pour ce spot</p>
                </div>
              );
            }

            // 3. Si image existe, prépare la source (http ou locale)
            const imageSrc = (rawImg && typeof rawImg === 'string')
              ? (rawImg.startsWith('http') ? rawImg : `/images/${rawImg.replace(/^\/?(images\/)?/, '')}`)
              : "/images/placeholder.jpg";

            return (
              <Image
                src={imageSrc}
                alt={location.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            );
          })()}
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
              className={`transition-colors ${saved ? "fill-red-500 text-red-500" : "text-stone-600"
                }`}
            />
          </button>

        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow min-h-[160px]">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-display font-bold text-stone-900 text-lg tracking-tight group-hover:text-moss-500 transition-colors">
              {location.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 text-stone-500 text-sm">
            <MapPin size={13} className="text-stone-400 flex-shrink-0" />
            <span className="truncate">{location.address}</span>
            {location.price_range && (
              <>
                <span className="mx-1 text-stone-300">•</span>
                <span className="text-amber-600 font-bold shrink-0">
                  {"$".repeat(location.price_range)}
                </span>
              </>
            )}
          </div>

          {location.description && variant === "default" && (
            <p className="mt-2.5 text-sm text-stone-500 line-clamp-2 leading-relaxed">
              {location.description}
            </p>
          )}

          {/* Rating */}
          {location.avg_rating && location.avg_rating > 0 && (
            <div className="flex items-center gap-1 mt-auto pt-3 text-sm border-t border-stone-50">
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
