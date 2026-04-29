import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  name: string;
  type: "location" | "review";
  subtitle?: string;
  locationId?: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "hero" | "compact";
}

export function SearchBar({
  onSearch,
  placeholder = "Rechercher un restaurant, un avis, un plat...",
  className = "",
  variant = "hero",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // 1. Search in Supabase Locations
        const { data: locations } = await supabase
          .from("locations")
          .select("id, name, address")
          .ilike("name", `%${query}%`)
          .limit(3);

        // 2. Search in Supabase Reviews
        const { data: reviews } = await supabase
          .from("reviews")
          .select("id, body, location_id, locations(name)")
          .ilike("body", `%${query}%`)
          .limit(3);

        // 3. Search in Mock Data
        const { MOCK_LOCATIONS } = await import("@/types");
        const filteredMocks = MOCK_LOCATIONS.filter(loc => 
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.address.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);

        const formattedResults: SearchResult[] = [
          ...(locations?.map(loc => ({
            id: loc.id,
            name: loc.name,
            type: "location" as const,
            subtitle: loc.address,
            locationId: loc.id
          })) || []),
          ...(filteredMocks.map(loc => ({
            id: loc.id,
            name: loc.name,
            type: "location" as const,
            subtitle: loc.address,
            locationId: loc.id
          }))),
          ...(reviews?.map((rev: any) => ({
            id: rev.id,
            name: rev.body.substring(0, 40) + "...",
            type: "review" as const,
            subtitle: `Avis sur ${rev.locations?.name || "un lieu"}`,
            locationId: rev.location_id
          })) || [])
        ];

        // Deduplicate by locationId to avoid showing the same place twice if it's in both DB and Mocks
        const uniqueResults = formattedResults.reduce((acc, current) => {
          const x = acc.find(item => item.name.toLowerCase().trim() === current.name.toLowerCase().trim());
          if (!x) return acc.concat([current]);
          return acc;
        }, [] as SearchResult[]);

        setResults(uniqueResults);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      setFocused(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(`/locations/${result.locationId}`);
    setFocused(false);
    setQuery("");
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`} ref={dropdownRef}>
      <motion.form
        onSubmit={handleSubmit}
        initial={variant === "hero" ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div
          className={`
            relative flex items-center rounded-2xl overflow-hidden transition-all duration-300
            ${focused ? "shadow-[0_0_0_3px_rgba(74,124,68,0.18),0_8px_40px_rgba(0,0,0,0.12)] border-moss-200" : "shadow-card border-transparent"}
            bg-white border
          `}
        >
          <div className="absolute left-5 text-stone-400 pointer-events-none">
            {loading ? <Loader2 size={20} className="animate-spin text-moss-500" /> : <Search size={20} />}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            className={`w-full bg-transparent border-none outline-none text-stone-800 placeholder:text-stone-400 ${variant === "hero" ? "py-4 pl-14 pr-36 text-base" : "py-3 pl-12 pr-4 text-sm"}`}
            aria-label="Search"
          />
          {variant === "hero" && (
            <button
              type="submit"
              className="absolute right-2 btn btn-primary btn-sm flex items-center gap-2 !rounded-xl"
            >
              <MapPin size={15} />
              <span className="hidden sm:inline">Explorer</span>
            </button>
          )}
        </div>
      </motion.form>

      {/* Results Dropdown */}
      <AnimatePresence>
        {focused && (results.length > 0 || (query.length >= 2 && !loading)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-[100]"
          >
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-stone-50 rounded-xl transition-colors text-left group"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${result.type === 'location' ? 'bg-moss-50 text-moss-600' : 'bg-amber-50 text-amber-600'}`}>
                      {result.type === 'location' ? <MapPin size={18} /> : <MessageSquare size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 truncate group-hover:text-moss-600 transition-colors">
                        {result.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate mt-0.5 italic">
                        {result.subtitle}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-stone-500 font-medium">Aucun résultat trouvé pour "{query}"</p>
                <p className="text-stone-400 text-xs mt-1">Essayez avec un autre mot-clé.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
