import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string;
          avatar_url?: string;
          bio?: string;
        };
        Update: {
          username?: string;
          avatar_url?: string;
          bio?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          category: string;
          description: string | null;
          lat: number | null;
          lng: number | null;
          created_by: string | null;
          avg_rating: number | null;
          hero_image: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          address: string;
          category: string;
          description?: string;
          lat?: number;
          lng?: number;
          created_by?: string;
          hero_image?: string;
        };
        Update: {
          name?: string;
          address?: string;
          category?: string;
          description?: string;
          lat?: number;
          lng?: number;
          hero_image?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          location_id: string;
          user_id: string;
          rating: number;
          body: string | null;
          created_at: string;
        };
        Insert: {
          location_id: string;
          user_id: string;
          rating: number;
          body?: string;
        };
        Update: {
          rating?: number;
          body?: string;
        };
      };
      saved_locations: {
        Row: {
          user_id: string;
          location_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          location_id: string;
        };
        Update: never;
      };
    };
  };
};
