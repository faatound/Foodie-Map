"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
}

interface UIState {
  mobileMenuOpen: boolean;
  authModalOpen: boolean;
  authModalMode: "login" | "signup";
  setMobileMenuOpen: (open: boolean) => void;
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
}

interface SavedState {
  savedIds: Set<string>;
  toggleSaved: (locationId: string) => void;
  isSaved: (locationId: string) => boolean;
}

type Store = AuthState & UIState & SavedState;

export const useStore = create<Store>((set, get) => ({
  // ── Auth ──────────────────────────────────────────────
  user: null,
  session: null,
  loading: true,
  setUser: (user) => {
    set({ user });
    if (user) get().loadFavorites(user.id);
    else set({ savedIds: new Set() });
  },
  setSession: (session) => {
    const user = session?.user ?? null;
    set({ session, user });
    if (user) get().loadFavorites(user.id);
    else set({ savedIds: new Set() });
  },
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, savedIds: new Set() });
  },

  // ── UI ────────────────────────────────────────────────
  mobileMenuOpen: false,
  authModalOpen: false,
  authModalMode: "login",
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  openAuthModal: (mode = "login") =>
    set({ authModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),

  // ── Saved locations ───────────────────────────────────
  savedIds: new Set<string>(),
  
  toggleSaved: async (locationId) => {
    const { savedIds, user } = get();
    if (!user) {
      get().openAuthModal("login");
      return;
    }

    const isCurrentlySaved = savedIds.has(locationId);
    const next = new Set(savedIds);
    
    if (isCurrentlySaved) {
      next.delete(locationId);
      // Persist to Supabase
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('location_id', locationId);
    } else {
      next.add(locationId);
      // Persist to Supabase
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, location_id: locationId });
    }
    
    set({ savedIds: next });
  },

  isSaved: (locationId) => get().savedIds.has(locationId),

  // Initialiser les favoris
  loadFavorites: async (userId: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('location_id')
      .eq('user_id', userId);
    
    if (data) {
      set({ savedIds: new Set(data.map(f => f.location_id)) });
    }
  },
}));
