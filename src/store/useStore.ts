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
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
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
  toggleSaved: (locationId) => {
    const { savedIds, user } = get();
    if (!user) {
      get().openAuthModal("login");
      return;
    }
    const next = new Set(savedIds);
    if (next.has(locationId)) next.delete(locationId);
    else next.add(locationId);
    set({ savedIds: next });
  },
  isSaved: (locationId) => get().savedIds.has(locationId),
}));
