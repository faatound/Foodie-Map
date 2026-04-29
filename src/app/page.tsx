"use client";

import { HeroSection } from "@/components/organisms/HeroSection";
import { CategoriesGrid } from "@/components/organisms/CategoriesGrid";
import { FeaturedLocations } from "@/components/organisms/FeaturedLocations";
import { DiscoverFoodies } from "@/components/organisms/DiscoverFoodies";
import { AboutSection } from "@/components/organisms/AboutSection";
import { CTASection } from "@/components/organisms/CTASection";
import { useStore } from "@/store/useStore";

export default function HomePage() {
  const { user } = useStore();

  return (
    <>
      <HeroSection />
      
      {/* Si l'utilisateur est connecté, les foodies sont en haut */}
      {user && <DiscoverFoodies />}
      
      <CategoriesGrid />
      <FeaturedLocations />
      
      {/* Si non connecté, les foodies sont ici */}
      {!user && <DiscoverFoodies />}
      
      <AboutSection />
      <CTASection />
    </>
  );
}
