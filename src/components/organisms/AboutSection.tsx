"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe2, Users, Utensils } from "lucide-react";

const FEATURES = [
  {
    icon: Globe2,
    title: "Découverte Globale",
    body: "Explorez des adresses dénichées aux quatre coins du monde, partagées par de vrais passionnés.",
    color: "text-moss-500",
    bg: "bg-moss-50",
  },
  {
    icon: Users,
    title: "Communauté Active",
    body: "Chaque recommandation vient d'un amateur de bonne cuisine. Vrais avis, vraies photos, vraies expériences.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Utensils,
    title: "Qualité Sélectionnée",
    body: "Nous ne mettons en avant que le meilleur. Du restaurant étoilé au street-food parfait — la qualité avant tout.",
    color: "text-rust-500",
    bg: "bg-rust-50",
  },
];

export function AboutSection() {
  return (
    <section className="py-24 relative" id="about">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-moss-500 mb-3 block">
            Notre mission
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-stone-900 tracking-tight">
            À Propos de The Foodie Map
          </h2>
          <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
            Connecter les passionnés de cuisine à travers des expériences partagées et des
            trouvailles délicieuses. Nous croyons que chaque repas est une aventure qui attend d'être vécue.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group card-base p-8 text-center"
            >
              <div
                className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 p-10 rounded-3xl bg-gradient-to-br from-moss-600 to-moss-500 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-[80px]" />
          <div className="relative z-10">
            <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3">
              Notre Vision
            </h3>
            <p className="text-white/80 max-w-xl mx-auto text-base leading-relaxed">
              Favoriser une communauté mondiale passionnée par la gastronomie, où chaque repas est
              une aventure, chaque restaurant une histoire, et chaque assiette un chef-d'œuvre
              à partager.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
