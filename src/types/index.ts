// ========================================================
// SHARED TYPES — THE FOODIE MAP
// ========================================================

export interface Location {
  id: string;
  name: string;
  address: string;
  category: CategorySlug;
  description: string | null;
  lat: number | null;
  lng: number | null;
  created_by: string | null;
  avg_rating: number | null;
  hero_image: string | null;
  created_at: string;
  // Joined fields
  profiles?: Profile;
  reviews?: Review[];
  photos?: Photo[];
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  location_id: string;
  user_id: string;
  rating: number;
  body: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface Photo {
  id: string;
  location_id: string;
  url: string;
  user_id: string;
  caption: string | null;
  created_at: string;
  profiles?: Profile;
}

export type CategorySlug =
  | "restaurants"
  | "bars"
  | "patisserie"
  | "fast-food"
  | "seaside"
  | "hotels";

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
  emoji: string;
  color: string;
  gradient: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "restaurants",
    label: "Restaurants",
    description: "Découvrez le sommet de la gastronomie de luxe au bord de mer à Dakar.",
    emoji: "🍽️",
    color: "#2d5a29",
    gradient: "from-moss-600 to-moss-400",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
  },
  {
    slug: "bars",
    label: "Bars & Restaurants",
    description: "L'élite des salons à cocktails hi-fi de Dakar.",
    emoji: "🍹",
    color: "#7c3aed",
    gradient: "from-purple-700 to-purple-400",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80",
  },
  {
    slug: "patisserie",
    label: "Patisseries & Cafés",
    description: "Pâtisseries d'exception de style français et cafés de luxe.",
    emoji: "🥐",
    color: "#d97706",
    gradient: "from-amber-600 to-amber-400",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80",
  },
  {
    slug: "fast-food",
    label: "Street food",
    description: "Le standard moderne du fast-food gastronomique à Dakar.",
    emoji: "🍔",
    color: "#d4603a",
    gradient: "from-rust-500 to-amber-400",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&q=80",
  },
  {
    slug: "seaside",
    label: "Bord de Mer",
    description: "Restaurants de plage, paillotes et spots avec vue sur l'eau.",
    emoji: "🌊",
    color: "#0369a1",
    gradient: "from-sky-700 to-sky-400",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
  },
  {
    slug: "hotels",
    label: "Hôtels",
    description: "Expériences culinaires tropicales au cœur de la Somone.",
    emoji: "🏨",
    color: "#854d0e",
    gradient: "from-amber-800 to-amber-600",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
  },
];

// Mock featured locations for static rendering
export const MOCK_LOCATIONS: Location[] = [
  {
    id: "1",
    name: "Le Terrou Bi - Le Gastronomique",
    address: "Bd Martin Luther King, Dakar",
    category: "restaurants",
    description:
      "La haute gastronomie à son apogée avec une vue panoramique sur l'océan Atlantique.",
    lat: 14.6867,
    lng: -17.4619,
    created_by: null,
    avg_rating: 4.9,
    hero_image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Diamono Hi-Fi Bar",
    address: "Terrou-Bi Resort, Dakar",
    category: "bars",
    description:
      "Un salon d'écoute hi-fi haut de gamme avec des cocktails artisanaux et une ambiance de classe mondiale.",
    lat: 14.6867,
    lng: -17.4619,
    created_by: null,
    avg_rating: 4.8,
    hero_image:
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1200&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Praline Dakar",
    address: "Almadies, Dakar",
    category: "patisserie",
    description:
      "Pâtisserie française authentique offrant les meilleurs croissants et viennoiseries du Sénégal.",
    lat: 14.7483,
    lng: -17.5147,
    created_by: null,
    avg_rating: 4.7,
    hero_image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Chicken Street Dakar",
    address: "Rue 6, Dakar",
    category: "fast-food",
    description:
      "Célèbre pour ses naans au fromage et son poulet frit parfaitement assaisonné.",
    lat: 14.6937,
    lng: -17.4441,
    created_by: null,
    avg_rating: 4.5,
    hero_image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Le Basilic Dakar",
    address: "Rue de cap vert, Dakar",
    category: "seaside",
    description:
      "Célèbre pour ses spécialités françaises et africaines dans un cadre verdoyant.",
    lat: 14.6937,
    lng: -17.4441,
    created_by: null,
    avg_rating: 4.9,
    hero_image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Africa Queen Resort",
    address: "Somone, Senegal",
    category: "hotels",
    description:
      "Dîner élégant en complexe hôtelier avec jardins tropicaux et service au bord de la piscine.",
    lat: 14.4842,
    lng: -17.0792,
    created_by: null,
    avg_rating: 4.8,
    hero_image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=80",
    created_at: new Date().toISOString(),
  },
];
