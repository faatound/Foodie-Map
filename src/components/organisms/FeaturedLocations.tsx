"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LocationCard } from "@/components/molecules/LocationCard";
import { Button } from "@/components/atoms/Button";
import { supabase } from "@/lib/supabase";
import { Location, MOCK_LOCATIONS } from "@/types";

export function FeaturedLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // 1. Trouver le profil de faa
        const { data: faaProfiles } = await supabase
          .from("profiles")
          .select("id")
          .or("full_name.ilike.%faa%,username.ilike.%faa%")
          .limit(1);

        let faaFavIds: string[] = [];
        if (faaProfiles && faaProfiles.length > 0) {
          const { data: favs } = await supabase
            .from("favorites")
            .select("location_id")
            .eq("user_id", faaProfiles[0].id);

          if (favs) {
            faaFavIds = favs.map((f: any) => f.location_id);
          }
        }

        let query = supabase.from("locations").select("*");

        if (faaFavIds.length > 0) {
          query = query.in("id", faaFavIds);
        } else {
          query = query.order("rating", { ascending: false }).order("created_at", { ascending: false }).limit(20);
        }

        const { data: dbData, error } = await query;
        let data: any[] = dbData ? [...dbData] : [];

        if (data.length > 0) {
          const userIds = Array.from(new Set(data.map(l => l.user_id || l.created_by).filter(Boolean)));
          if (userIds.length > 0) {
            const { data: profilesData } = await supabase.from("profiles").select("id, full_name, username").in("id", userIds);
            if (profilesData) {
              const profileMap = new Map(profilesData.map(p => [p.id, p]));
              data.forEach(loc => {
                const uid = loc.user_id || loc.created_by;
                if (uid && profileMap.has(uid)) {
                  loc.profiles = profileMap.get(uid);
                }
              });
            }
          }
        }

        // Pour s'assurer que Meraki (8) et d'autres favoris locaux apparaissent toujours,
        // nous les injectons par défaut car les MOCK_LOCATIONS ne peuvent pas être 
        // sauvegardés dans la base de données (erreur de clé étrangère).
        const defaultMockFavs = ["8", "1", "15"]; // Meraki, Phare, Oasis
        const allFavIdsToFetch = Array.from(new Set([...faaFavIds, ...defaultMockFavs]));
        
        const foundIds = new Set(data.map(l => String(l.id)));
        const missingIds = allFavIdsToFetch.filter(id => !foundIds.has(String(id)));
        
        if (missingIds.length > 0) {
          const mockFavs = MOCK_LOCATIONS.filter(m => missingIds.includes(String(m.id)));
          // On met les favoris en premier pour garantir qu'ils s'affichent
          data = [...mockFavs, ...data];
        }

        if (error) {
          console.error("Erreur Supabase détaillée:", error.message, error.details, error.hint);
          throw error;
        }
        if (data) {
          // Filtrage par photo, description et déduplication par nom
          const filteredLocations: Location[] = [];
          const seenNames = new Set();

          data.forEach((loc: any) => {
            // 1. Vérifier si une photo existe
            const rawImg = loc.image_url || loc.hero_image || (loc.images && Array.isArray(loc.images) && loc.images.length > 0 ? loc.images[0] : null);
            const hasImage = rawImg && typeof rawImg === 'string' && rawImg.length > 4;

            // 2. Vérifier si une description existe (au moins 10 caractères)
            const hasDescription = loc.description && loc.description.trim().length >= 10;

            if (!hasImage || !hasDescription) return;

            const nameKey = loc.name.toLowerCase().trim();
            if (!seenNames.has(nameKey) && filteredLocations.length < 6) {
              seenNames.add(nameKey);
              filteredLocations.push(loc as Location);
            }
          });

          setLocations(filteredLocations);
        }
      } catch (err: any) {
        console.error("Erreur récupération lieux:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-moss-500 animate-spin" />
        <p className="text-stone-400 font-medium animate-pulse">Chargement des pépites...</p>
      </div>
    );
  }

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
          {locations.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
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
