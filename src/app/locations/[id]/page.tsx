"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Camera,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { StarRating } from "@/components/atoms/StarRating";
import { MOCK_LOCATIONS, CATEGORIES } from "@/types";
import { useStore } from "@/store/useStore";

export default function LocationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, toggleSaved, isSaved, openAuthModal } = useStore();

  const location = MOCK_LOCATIONS.find((l) => l.id === id);
  const category = CATEGORIES.find((c) => c.slug === location?.category);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Location not found</h1>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const saved = isSaved(location.id);

  // Gallery images
  const images = [
    location.hero_image!,
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=70",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=70",
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Image Gallery */}
      <div className="container-xl py-6">
        <Link
          href={`/categories/${location.category}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-moss-600 transition-colors mb-4 focus-ring"
        >
          <ArrowLeft size={14} />
          Back to {category?.label || "category"}
        </Link>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden h-[300px] sm:h-[400px] md:h-[450px]">
          <div className="md:col-span-2 md:row-span-2 relative group">
            <Image
              src={images[0]}
              alt={location.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
          {images.slice(1).map((img, i) => (
            <div key={i} className="relative hidden md:block group overflow-hidden">
              <Image
                src={img}
                alt={`${location.name} photo ${i + 2}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container-xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category badge */}
              {category && (
                <Badge color={category.color} variant="soft" className="mb-3">
                  {category.emoji} {category.label}
                </Badge>
              )}

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight mb-3">
                {location.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-stone-400" />
                  {location.address}
                </span>
                {location.avg_rating && (
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <strong className="text-stone-800">{location.avg_rating.toFixed(1)}</strong>
                    / 5
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-stone-400" />
                  Open now
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button
                  variant={saved ? "primary" : "secondary"}
                  size="sm"
                  icon={
                    <Heart
                      size={15}
                      className={saved ? "fill-white" : ""}
                    />
                  }
                  onClick={() => toggleSaved(location.id)}
                >
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button variant="secondary" size="sm" icon={<Share2 size={15} />}>
                  Share
                </Button>
                {user && (
                  <Button variant="amber" size="sm" icon={<Camera size={15} />}>
                    Add Photos
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ExternalLink size={15} />}
                >
                  Directions
                </Button>
              </div>

              {/* Description */}
              <div className="prose prose-stone max-w-none">
                <h2 className="font-display font-bold text-xl text-stone-900 mb-3">
                  About this place
                </h2>
                <p className="text-stone-600 leading-relaxed">
                  {location.description}
                </p>
                <p className="text-stone-600 leading-relaxed mt-3">
                  This cherished location has earned a reputation among locals and travelers
                  alike for its outstanding culinary offerings, warm atmosphere, and
                  dedication to quality. Whether you&apos;re stopping by for a quick bite or
                  settling in for a leisurely meal, every visit promises something memorable.
                </p>
              </div>

              {/* Reviews section */}
              <div className="mt-12">
                <h2 className="font-display font-bold text-xl text-stone-900 mb-6">
                  Community Reviews
                </h2>

                {/* Sample review */}
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah M.",
                      rating: 5,
                      date: "2 days ago",
                      body: "Absolutely incredible! The ambiance was perfect and the food was out of this world. Highly recommend the chef's special.",
                    },
                    {
                      name: "Marcus L.",
                      rating: 4,
                      date: "1 week ago",
                      body: "Great experience overall. The menu was creative and the service was top-notch. Will definitely be coming back.",
                    },
                  ].map((review, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="card-base p-5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-stone-900 text-sm">{review.name}</p>
                          <p className="text-xs text-stone-400">{review.date}</p>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed">{review.body}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Write review CTA */}
                <div className="mt-6">
                  {user ? (
                    <Button variant="secondary" icon={<Star size={15} />}>
                      Write a Review
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => openAuthModal("login")}
                    >
                      Log in to write a review
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-28 space-y-5"
            >
              {/* Info card */}
              <div className="card-base p-6">
                <h3 className="font-display font-bold text-stone-900 text-base mb-4">
                  Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-stone-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-700">Address</p>
                      <p className="text-stone-500">{location.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-stone-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-700">Hours</p>
                      <p className="text-stone-500">Mon-Sun: 11:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="card-base overflow-hidden">
                <div className="h-48 bg-stone-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={28} className="text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-400">Interactive map</p>
                    <p className="text-xs text-stone-300">Coming soon</p>
                  </div>
                </div>
              </div>

              {/* Share card */}
              <div className="card-base p-5 glass">
                <p className="text-sm font-medium text-stone-700 mb-3">Share this place</p>
                <div className="flex gap-2">
                  {["Twitter", "WhatsApp", "Copy Link"].map((label) => (
                    <button
                      key={label}
                      className="flex-1 py-2 rounded-xl bg-stone-50 text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors focus-ring"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
