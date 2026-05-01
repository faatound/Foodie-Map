"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, CheckCircle } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { supabase } from "@/lib/supabase";

export function DiscoverFoodies() {
  const [foodies, setFoodies] = useState<any[]>([]);

  useEffect(() => {
    const fetchFoodies = async () => {
      try {
        // 1. Récupérer toutes les adresses pour compter les partages par utilisateur
        const { data: locations } = await supabase.from('locations').select('user_id');
        
        const counts: Record<string, number> = {};
        if (locations) {
          locations.forEach(loc => {
            if (loc.user_id) {
              counts[loc.user_id] = (counts[loc.user_id] || 0) + 1;
            }
          });
        }

        // Trier les IDs d'utilisateurs par nombre de partages (du plus actif au moins actif)
        const sortedActiveUserIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

        let activeProfiles: any[] = [];
        if (sortedActiveUserIds.length > 0) {
          // Récupérer les profils de ceux qui ont partagé au moins 1 lieu
          const { data } = await supabase.from('profiles').select('*').in('id', sortedActiveUserIds);
          if (data) {
            // Remettre dans l'ordre du tri
            activeProfiles = data.sort((a, b) => {
              return sortedActiveUserIds.indexOf(a.id) - sortedActiveUserIds.indexOf(b.id);
            });
          }
        }

        // 2. Toujours inclure le profil de "faa" par défaut (ou s'il n'y a pas assez d'actifs, récupérer les derniers inscrits)
        const { data: faaProfiles } = await supabase
          .from('profiles')
          .select('*')
          .or('full_name.ilike.%faa%,username.ilike.%faa%')
          .limit(1);

        // 3. Combiner et dédupliquer (Max 12 profils)
        const allFoodiesMap = new Map();
        
        // Ajouter d'abord Faa (en premier)
        if (faaProfiles && faaProfiles.length > 0) {
          allFoodiesMap.set(faaProfiles[0].id, faaProfiles[0]);
        }
        
        // Ajouter les foodies actifs (ceux qui ont partagé au moins 1 lieu)
        activeProfiles.forEach(p => {
          // On n'exclut que si c'est EXACTEMENT le nom générique "Foodie Mystère"
          const isMystery = p.full_name === "Foodie Mystère";
                           
          if (!isMystery && !allFoodiesMap.has(p.id)) {
            allFoodiesMap.set(p.id, p);
          }
        });

        setFoodies(Array.from(allFoodiesMap.values()).slice(0, 12));
      } catch (err) {
        console.error("Erreur récupération foodies:", err);
      }
    };
    fetchFoodies();
  }, []);

  // Ne rien afficher si on a pas de foodies à montrer
  if (foodies.length === 0) return null;

  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden" id="foodies">
      <div className="container-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users size={16} className="text-moss-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-moss-600">
              Notre Communauté
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Découvrez nos Foodies
          </h2>
          <p className="text-stone-500 mt-3 max-w-lg mx-auto text-base leading-relaxed">
            Rencontrez les membres passionnés qui partagent leurs meilleures adresses à Dakar.
          </p>
        </motion.div>

        {/* Scroll horizontal sur mobile, grille sur desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center gap-6 sm:gap-10 snap-x snap-mandatory hide-scrollbar">
          {foodies.map((foodie, i) => {
            const MotionLink = motion.create(Link);
            return (
              <MotionLink
                key={foodie.id}
                href={`/users/${foodie.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-3 w-28 shrink-0 snap-center cursor-pointer group"
              >
                <div className="relative">
                  <Avatar
                    src={foodie.avatar_url}
                    alt={foodie.full_name || foodie.username || "Foodie"}
                    className="w-20 h-20 sm:w-24 sm:h-24 shadow-md border-4 border-white group-hover:border-moss-200 transition-colors"
                  />
                  {foodie.is_certified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle size={20} className="text-blue-500 fill-white" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-moss-600 transition-colors">
                    {foodie.full_name || "Foodie"}
                  </p>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    @{foodie.username || foodie.full_name?.replace(/\s/g, '').toLowerCase() || "user"}
                  </p>
                </div>
              </MotionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
