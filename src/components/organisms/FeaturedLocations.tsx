"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LocationCard } from "@/components/molecules/LocationCard";
import { MOCK_LOCATIONS } from "@/types";
import { Button } from "@/components/atoms/Button";

export function FeaturedLocations() {
  return (
    <section className="py-24 bg-cream-100 relative overflow-hidden" id="featured">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-200/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-moss-200/20 blur-[100px] pointer-events-none" />

      <div className="container-xl relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">
                En vogue actuellement
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Lieux à la une
            </h2>
            <p className="text-stone-500 mt-2 max-w-md text-base">
              Les meilleures adresses sélectionnées par notre communauté de passionnés.
            </p>
          </div>

          <Link href="/categories/restaurants" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="group">
              Tout voir
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.id} location={loc} index={i} />
          ))}
        </div>

        {/* Mobile "View all" */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/categories/restaurants">
            <Button variant="secondary" className="w-full">
              Voir tous les lieux
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
