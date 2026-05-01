"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { LocationCard } from "@/components/molecules/LocationCard";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, MOCK_LOCATIONS, Location } from "@/types";
import { Button } from "@/components/atoms/Button";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [locations, setLocations] = React.useState<Location[]>([]);
  const [loading, setLoading] = React.useState(true);

  const category = CATEGORIES.find((c) => c.slug === slug);

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        // Fetch real locations from Supabase
        const { data, error } = await supabase
          .from("locations")
          .select("*, profiles(full_name, username)")
          .eq("category", slug);

        let realLocations: Location[] = [];
        if (data) {
          // Déduplication par nom pour éviter les doublons (comme Mims)
          const uniqueLocations: Location[] = [];
          const seenNames = new Set();
          
          (data as any[]).forEach(loc => {
            const nameKey = loc.name.toLowerCase().trim();
            if (!seenNames.has(nameKey)) {
              seenNames.add(nameKey);
              uniqueLocations.push(loc as Location);
            }
          });
          
          realLocations = uniqueLocations;
        }

        // Filter mocks for this category
        const mockLocations = MOCK_LOCATIONS.filter((l) => l.category === slug);

        // Merge and deduplicate by name
        const combined = [...realLocations, ...mockLocations];
        const finalUnique: Location[] = [];
        const seenFinal = new Set();
        
        combined.forEach(l => {
          const nameKey = l.name.toLowerCase().trim();
          if (!seenFinal.has(nameKey)) {
            seenFinal.add(nameKey);
            finalUnique.push(l);
          }
        });

        setLocations(finalUnique);
      } catch (error) {
        console.error("Erreur récupération lieux par catégorie:", error);
        // Fallback to mocks only
        setLocations(MOCK_LOCATIONS.filter((l) => l.category === slug));
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchLocations();
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Catégorie non trouvée</h1>
          <Link href="/">
            <Button variant="primary">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src={category.image}
          alt={category.label}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-8 container-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-4 focus-ring"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{category.emoji}</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                {category.label}
              </h1>
            </div>
            <p className="text-white/70 max-w-lg">{category.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Listings */}
      <div className="container-xl py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="animate-spin rounded-full h-10 w-10 border-4 border-moss-500 border-t-transparent" />
             <p className="text-stone-400 font-medium">Chargement des lieux...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-stone-500 text-sm">
                <strong className="text-stone-800">{locations.length}</strong> lieux trouvés
              </p>
            </div>

            {locations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc, i) => (
              <LocationCard key={loc.id} location={loc} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-stone-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-stone-900 mb-2">
              No places yet
            </h3>
            <p className="text-stone-500 mb-6">
              Be the first to add a place in this category!
            </p>
            <Link href="/add-location">
              <Button variant="primary">Add a Place</Button>
            </Link>
          </motion.div>
        )}
      </>
    )}
  </div>
</div>
);
}
