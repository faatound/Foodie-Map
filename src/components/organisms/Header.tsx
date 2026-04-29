"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Plus, User, LogOut, ChefHat } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { useStore } from "@/store/useStore";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/categories/restaurants", label: "Catégories" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { user, mobileMenuOpen, setMobileMenuOpen, openAuthModal, signOut } =
    useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 glass shadow-nav"
            : "py-5 bg-transparent"
        }`}
        role="banner"
      >
        <div className="container-xl flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-ring"
            aria-label="The Foodie Map Home"
            id="nav-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-moss-500 to-moss-400 flex items-center justify-center shadow-glow-moss">
              <ChefHat size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-stone-900">
              The Foodie Map
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="btn-ghost text-sm font-medium rounded-xl px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/add-location">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus size={15} />}
                  >
                    Ajouter
                  </Button>
                </Link>
                <Link href="/profile" className="flex items-center">
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.full_name || "User"}
                    size="sm"
                    className="hover:shadow-glow-moss transition-shadow cursor-pointer"
                  />
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal("signup")}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link href="/profile" className="flex items-center p-1">
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  alt={user.user_metadata?.full_name || "User"}
                  size="sm"
                  className="shadow-sm border border-stone-100"
                />
              </Link>
            )}
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-stone-100 transition-colors focus-ring"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-40 md:hidden shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-stone-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 flex-1" aria-label="Mobile navigation">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-700 font-medium hover:bg-stone-50 transition-colors"
                    >
                      <MapPin size={16} className="text-stone-400" />
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/add-location"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-moss-600 font-medium hover:bg-moss-50 transition-colors"
                  >
                    <Plus size={16} />
                    Ajouter un lieu
                  </Link>
                </nav>

                <div className="pt-4 border-t border-stone-100 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-700 font-medium hover:bg-stone-50 transition-colors"
                      >
                        <User size={16} className="text-stone-400" />
                        Profil
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut size={16} />
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          openAuthModal("login");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Connexion
                      </Button>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          openAuthModal("signup");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Inscription
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
