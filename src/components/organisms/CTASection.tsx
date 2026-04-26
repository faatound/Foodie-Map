"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Camera, Star } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useStore } from "@/store/useStore";
import Link from "next/link";

export function CTASection() {
  const { user, openAuthModal } = useStore();

  const handleCTA = () => {
    if (!user) {
      openAuthModal("signup");
    }
  };

  return (
    <section className="py-24 relative overflow-hidden" id="cta">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
          <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />

          {/* Decorative elements */}
          <div className="absolute top-[-50px] right-[-30px] w-72 h-72 rounded-full bg-amber-400/10 blur-[80px]" />
          <div className="absolute bottom-[-40px] left-[-20px] w-64 h-64 rounded-full bg-moss-400/10 blur-[80px]" />

          {/* Floating icons */}
          <div className="absolute top-12 right-12 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-float opacity-40 hidden lg:flex">
            <Camera size={20} className="text-amber-300" />
          </div>
          <div className="absolute bottom-12 left-16 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center animate-float [animation-delay:1.5s] opacity-40 hidden lg:flex">
            <Star size={16} className="text-amber-300" />
          </div>
          <div className="absolute top-1/2 right-[15%] w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center animate-float [animation-delay:3s] opacity-30 hidden lg:flex">
            <MapPin size={18} className="text-moss-300" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-amber-400 mb-4">
                Rejoignez la communauté
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight max-w-2xl mx-auto leading-tight">
                Devenez un Explorateur Foodie !
              </h2>
              <p className="text-stone-400 mt-4 max-w-lg mx-auto text-base leading-relaxed">
                Partagez vos découvertes culinaires préférées avec la communauté. Ajoutez de nouveaux lieux, uploadez des photos et inspirez d'autres passionnés.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {user ? (
                  <Link href="/add-location">
                    <Button variant="amber" size="lg" icon={<MapPin size={18} />}>
                      Ajouter un lieu
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="amber"
                    size="lg"
                    icon={<MapPin size={18} />}
                    onClick={handleCTA}
                  >
                    Ajouter un lieu
                  </Button>
                )}
                <Button variant="ghost" size="lg" className="!text-stone-300 hover:!text-white hover:!bg-white/5">
                  En savoir plus
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {["#4a7c44", "#d97706", "#d4603a", "#7c3aed"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-stone-800 flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    )
                  )}
                </div>
                <span className="text-sm text-stone-400">
                  Plus de <strong className="text-white">850</strong> foodies explorent déjà
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
