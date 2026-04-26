import { HeroSection } from "@/components/organisms/HeroSection";
import { CategoriesGrid } from "@/components/organisms/CategoriesGrid";
import { FeaturedLocations } from "@/components/organisms/FeaturedLocations";
import { AboutSection } from "@/components/organisms/AboutSection";
import { CTASection } from "@/components/organisms/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <FeaturedLocations />
      <AboutSection />
      <CTASection />
    </>
  );
}
