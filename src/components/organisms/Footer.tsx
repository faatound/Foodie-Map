"use client";

import React from "react";
import Link from "next/link";
import { ChefHat, Link2, Globe, MessageCircle, Heart } from "lucide-react";

const FOOTER_LINKS = {
  Explorer: [
    { label: "Restaurants", href: "/categories/restaurants" },
    { label: "Bars & Cocktails", href: "/categories/bars" },
    { label: "Pâtisserie & Cafés", href: "/categories/patisserie" },
    { label: "Fast Food", href: "/categories/fast-food" },
    { label: "Bord de Mer", href: "/categories/seaside" },
    { label: "Hôtels", href: "/categories/hotels" },
  ],
  Société: [
    { label: "À propos", href: "/#about" },
    { label: "Contact", href: "/contact" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "Conditions d'utilisation", href: "#" },
  ],
  Communauté: [
    { label: "Ajouter un lieu", href: "/add-location" },
    { label: "Top Contributeurs", href: "#" },
    { label: "Blog", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="relative mt-24 bg-stone-950 text-stone-300 overflow-hidden"
      role="contentinfo"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-glow-moss opacity-20 pointer-events-none" />

      <div className="container-xl relative z-10 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 focus-ring">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-moss-500 to-moss-400 flex items-center justify-center">
                <ChefHat size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                The Foodie Map
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-[260px]">
              Connecter les passionnés de cuisine à travers des expériences partagées. 
              Découvrez, partagez et savourez les meilleures adresses du monde.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {[
                { Icon: Globe, label: "Twitter" },
                { Icon: MessageCircle, label: "Instagram" },
                { Icon: Link2, label: "GitHub" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-stone-800 text-stone-400 flex items-center justify-center hover:bg-moss-600 hover:text-white transition-colors focus-ring"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors focus-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-800 mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} The Foodie Map. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec <Heart size={12} className="text-red-500 fill-red-500" /> par
            la communauté Foodie
          </p>
        </div>
      </div>
    </footer>
  );
}
