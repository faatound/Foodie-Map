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
  rating: number | null;
  hero_image: string | null;
  image_url?: string | null; // Support pour la nouvelle colonne Supabase
  price_range?: number | null; // 1: Economique, 2: Moyen, 3: Luxe
  images?: string[]; // Ajout des photos uploadées
  created_at: string;
  // Joined fields
  profiles?: Profile;
  reviews?: Review[];
  photos?: Photo[];
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_certified?: boolean;
  total_restaurants?: number;
  created_at: string;
}

export interface Review {
  id: string;
  location_id: string;
  user_id: string;
  rating: number;
  rating_service?: number;
  rating_decor?: number;
  rating_food?: number;
  body: string | null;
  photos?: string[];
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
    image: "/images/basilic.jpeg",
  },
  {
    slug: "bars",
    label: "Bars & Restaurants",
    description: "L'élite des salons à cocktails hi-fi de Dakar.",
    emoji: "🍹",
    color: "#7c3aed",
    gradient: "from-purple-700 to-purple-400",
    image: "/images/diamono.jpeg",
  },
  {
    slug: "patisserie",
    label: "Patisseries & Cafés",
    description: "Pâtisseries d'exception de style français et cafés de luxe.",
    emoji: "🥐",
    color: "#d97706",
    gradient: "from-amber-600 to-amber-400",
    image: "/images/helena1.jpeg",
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
    image: "/images/TerrouBi.jpeg",
  },
  {
    slug: "hotels",
    label: "Hôtels",
    description: "Expériences culinaires tropicales au cœur de la Somone.",
    emoji: "🏨",
    color: "#854d0e",
    gradient: "from-amber-800 to-amber-600",
    image: "/images/africaqueen.jpeg",
  },
];

export const MOCK_LOCATIONS: Location[] = [
  {
    id: "1",
    name: "Phare des Mamelles",
    address: "Ouakam, Dakar",
    category: "restaurants",
    description: "Une vue imprenable sur tout Dakar avec une cuisine raffinée.",
    lat: 14.723,
    lng: -17.512,
    created_by: null,
    avg_rating: 4.8,
    hero_image: "/images/phare.jpeg",
    price_range: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Piazza",
    address: "Plateau, Dakar",
    category: "restaurants",
    description: "L'authenticité italienne au cœur de Dakar.",
    lat: 14.667,
    lng: -17.433,
    created_by: null,
    avg_rating: 4.7,
    hero_image: "/images/piazza.jpeg",
    price_range: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Mims",
    address: "Corniche Ouest, Dakar",
    category: "restaurants",
    description: "Cuisine généreuse et cadre moderne pour vos déjeuners.",
    lat: 14.712,
    lng: -17.456,
    created_by: null,
    avg_rating: 4.6,
    hero_image: "/images/mims2.jpeg",
    price_range: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Kotao",
    address: "Almadies, Dakar",
    category: "restaurants",
    description: "L'Asie dans votre assiette avec une touche dakaroise.",
    lat: 14.748,
    lng: -17.514,
    created_by: null,
    avg_rating: 4.9,
    hero_image: "/images/kotao.jpeg",
    price_range: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Farid",
    address: "Plateau, Dakar",
    category: "restaurants",
    description: "Spécialités libanaises raffinées depuis des décennies.",
    lat: 14.669,
    lng: -17.435,
    created_by: null,
    avg_rating: 4.8,
    hero_image: "/images/farid.jpeg",
    price_range: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Groov",
    address: "Almadies, Dakar",
    category: "bars",
    description: "Ambiance lounge et cocktails signatures.",
    lat: 14.745,
    lng: -17.512,
    created_by: null,
    avg_rating: 4.7,
    hero_image: "/images/groov.jpeg",
    price_range: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Diamono",
    address: "Dakar, Sénégal",
    category: "bars",
    description: "Le bar-resto traditionnel pour une soirée authentique.",
    lat: 14.710,
    lng: -17.448,
    created_by: null,
    avg_rating: 4.5,
    hero_image: "/images/diamono.jpeg",
    price_range: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Meraki",
    address: "Plateau, Dakar",
    category: "patisserie",
    description: "Le temple du café et de la pâtisserie fine.",
    lat: 14.665,
    lng: -17.431,
    created_by: null,
    avg_rating: 4.9,
    hero_image: "/images/meraki.jpeg",
    price_range: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Praline",
    address: "Point E, Dakar",
    category: "patisserie",
    description: "Des chocolats et douceurs d'exception.",
    lat: 14.692,
    lng: -17.452,
    created_by: null,
    avg_rating: 4.8,
    hero_image: "/images/praline.jpeg",
    price_range: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Sarayi",
    address: "Mermoz, Dakar",
    category: "patisserie",
    description: "Brunch et pâtisserie turque incomparable.",
    lat: 14.704,
    lng: -17.468,
    created_by: null,
    avg_rating: 4.8,
    hero_image: "/images/sarayi.jpeg",
    price_range: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    name: "Keurgui",
    address: "Dakar, Sénégal",
    category: "patisserie",
    description: "Le goût authentique du pain chaud et des viennoiseries.",
    lat: 14.725,
    lng: -17.442,
    created_by: null,
    avg_rating: 4.7,
    hero_image: "/images/keurgui.jpeg",
    price_range: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "12",
    name: "Basilic",
    address: "Corniche, Dakar",
    category: "seaside",
    description: "Cuisine fraîcheur les pieds dans l'eau.",
    lat: 14.685,
    lng: -17.462,
    created_by: null,
    avg_rating: 4.6,
    hero_image: "/images/basilic.jpeg",
    price_range: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "13",
    name: "Terrou-Bi",
    address: "Corniche Ouest, Dakar",
    category: "seaside",
    description: "L'excellence du luxe en bord de mer.",
    lat: 14.682,
    lng: -17.465,
    created_by: null,
    avg_rating: 4.9,
    hero_image: "/images/TerrouBi.jpeg",
    price_range: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "14",
    name: "Africa Queen Buffet",
    address: "Somone, Sénégal",
    category: "hotels",
    description: "Buffet panoramique face à l'océan.",
    lat: 14.483,
    lng: -17.108,
    created_by: null,
    avg_rating: 4.7,
    hero_image: "/images/africaqueenbuffet.jpeg",
    price_range: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "15",
    name: "Oasis",
    address: "Corniche des Almadies, Dakar",
    category: "restaurants",
    description: "Un cadre idyllique sur la corniche avec une vue imprenable sur l'océan. Idéal pour un moment de détente super beau.",
    lat: 14.750,
    lng: -17.518,
    created_by: null,
    avg_rating: 4.8,
    hero_image: "Oasis.jpeg",
    price_range: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "16",
    name: "H&Co",
    address: "55 Bd de St louis, Dakar",
    category: "patisserie",
    description: "L'excellence de la pâtisserie et du café au cœur de Dakar.",
    lat: 14.675,
    lng: -17.438,
    created_by: null,
    avg_rating: 4.9,
    hero_image: "h&co1.jpeg",
    price_range: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "17",
    name: "Dakytori",
    address: "4 boulevard El Hadj Djily Mbaye, Dakar",
    category: "restaurants",
    description: "Une expérience culinaire unique au cœur de Dakar, alliant tradition et modernité.",
    lat: 14.671,
    lng: -17.432,
    created_by: null,
    avg_rating: 4.7,
    hero_image: "dakytory1.jpeg",
    price_range: 2,
    created_at: new Date().toISOString(),
  },
];
