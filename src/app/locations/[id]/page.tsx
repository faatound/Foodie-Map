"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Utensils,
  User,
  Layout,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { StarRating } from "@/components/atoms/StarRating";
import { supabase } from "@/lib/supabase";
import { Location, CATEGORIES, Review } from "@/types";
import { useStore } from "@/store/useStore";

// Les avis sont maintenant récupérés dynamiquement depuis la base de données.
const MOCK_REVIEWS: any[] = [];

export default function LocationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, toggleSaved, isSaved, openAuthModal } = useStore();

  const [location, setLocation] = React.useState<Location | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [uploadingReview, setUploadingReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    rating_food: 5,
    rating_service: 5,
    rating_decor: 5,
    body: ""
  });
  const reviewFilesRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        // Try Supabase first
        const { data, error } = await supabase
          .from("locations")
          .select("*, profiles(full_name, username), reviews(*, profiles(username))")
          .eq("id", id)
          .single();

        if (data) {
          setLocation(data as Location);
          return;
        }

        // Fallback to MOCK_LOCATIONS if not found in DB
        const { MOCK_LOCATIONS } = await import("@/types");
        const mockLoc = MOCK_LOCATIONS.find((l) => l.id === id);
        if (mockLoc) {
          setLocation(mockLoc);
        }
      } catch (error) {
        console.warn("Lieu non trouvé dans Supabase, tentative avec les mocks...");
        const { MOCK_LOCATIONS } = await import("@/types");
        const mockLoc = MOCK_LOCATIONS.find((l) => l.id === id);
        if (mockLoc) {
          setLocation(mockLoc);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!user || !location) return;
    try {
      setUploadingReview(true);
      const { error } = await supabase
        .from("reviews")
        .insert({
          location_id: location.id,
          user_id: user.id,
          rating: reviewData.rating,
          rating_food: reviewData.rating_food,
          rating_service: reviewData.rating_service,
          rating_decor: reviewData.rating_decor,
          body: reviewData.body,
        });

      if (error) throw error;

      alert("Merci ! Votre avis a été publié.");
      setShowReviewForm(false);
      setReviewData({ rating: 5, rating_food: 5, rating_service: 5, rating_decor: 5, body: "" });
      
      // Optionnel: Mettre à jour localement les avis pour éviter le reload
      const newReview = {
        id: Math.random().toString(),
        location_id: location.id,
        user_id: user.id,
        rating: reviewData.rating,
        rating_food: reviewData.rating_food,
        rating_service: reviewData.rating_service,
        rating_decor: reviewData.rating_decor,
        body: reviewData.body,
        created_at: new Date().toISOString(),
        profiles: {
          username: user.user_metadata?.username || user.email?.split('@')[0] || "Moi"
        }
      };
      
      setLocation(prev => prev ? {
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])]
      } : null);
    } catch (err: any) {
      alert("Erreur lors de la publication : " + err.message);
    } finally {
      setUploadingReview(false);
    }
  };

  const handleReviewPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      if (!user || !location) return;

      setUploadingReview(true);
      const files = Array.from(event.target.files);
      const { uploadReviewPhoto } = await import("@/lib/storage");

      const uploadPromises = files.map(file => uploadReviewPhoto(location.id, user.id, file));
      const urls = await Promise.all(uploadPromises);

      // Ne mettre à jour l'image de couverture que si aucune n'existe du tout
      const hasExistingImages = (location.images && Array.isArray(location.images) && location.images.length > 0) || location.image_url;
      const primaryImage = hasExistingImages ? (location.image_url || location.images?.[0]) : urls[0];
      
      const allImages = [...(Array.isArray(location.images) ? location.images : []), ...urls];

      const { error: updateError } = await supabase
        .from("locations")
        .update({
          images: allImages,
          image_url: primaryImage
        })
        .eq("id", location.id);

      if (updateError) throw updateError;

      setLocation(prev => prev ? {
        ...prev,
        images: allImages,
        image_url: primaryImage
      } : null);

      alert(`${urls.length} photo(s) ajoutée(s) à la galerie !`);

    } catch (error: any) {
      alert("Erreur : " + error.message);
    } finally {
      setUploadingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-stone-50 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-moss-500 border-t-transparent" />
        <p className="text-stone-500 font-medium">Chargement du lieu...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-stone-50">
        <div className="text-center card-base p-10 max-w-sm">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Lieu non trouvé</h1>
          <Link href="/">
            <Button variant="primary" className="w-full">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.slug === location.category);
  const saved = isSaved(location.id);

  // Gallery images logic: combine hero and gallery images
  const galleryImages = [
    location.image_url,
    location.hero_image,
    ...(location.images || [])
  ]
    .filter(img => img && typeof img === 'string' && img.length > 5)
    .map(img => (img as string).trim().replace(/^["']|["']$/g, '')) as string[];

  const displayImages = [...galleryImages];

  return (
    <div className="min-h-screen pt-20 bg-stone-50/30">
      {/* Header Navigation */}
      <div className="container-xl py-6">
        <Link
          href={`/categories/${location.category}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-moss-600 transition-colors mb-4 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Retour aux {category?.label || "catégories"}
        </Link>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-[2.5rem] overflow-hidden h-[350px] sm:h-[450px] md:h-[500px] shadow-card">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer bg-stone-100 flex items-center justify-center">
            <Image
              src={
                (displayImages[0] && typeof displayImages[0] === 'string')
                  ? (displayImages[0].startsWith('http') ? displayImages[0] : `/images/${displayImages[0].replace(/^\/?(images\/)?/, '')}`)
                  : "/images/placeholder.jpg"
              }
              alt={location.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          </div>
          
          {displayImages.slice(1, 5).map((img, i) => (
            <div key={i} className="relative hidden md:block group overflow-hidden cursor-pointer h-full">
              <Image
                src={img.startsWith('http') ? img : `/images/${img.replace(/^\/?(images\/)?/, '')}`}
                alt={`${location.name} photo ${i + 2}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              
              {/* Overlay pour le "Voir plus" sur la dernière image si plus de 5 photos au total */}
              {i === 3 && displayImages.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                  <p className="text-2xl font-bold">+{displayImages.length - 5}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Photos</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info & Reviews */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Info Header */}
              <div className="space-y-4">
                {category && (
                  <Badge color={category.color} variant="soft" className="px-3 py-1 text-xs uppercase font-bold tracking-widest">
                    {category.emoji} {category.label}
                  </Badge>
                )}

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
                  {location.name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-stone-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-moss-500" />
                    <span className="font-medium">{location.address}</span>
                  </div>
                  {location.rating && (
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                      <StarRating rating={location.rating} size={15} />
                      <span className="text-stone-400">({location.reviews?.length || 0} avis)</span>
                      {location.price_range && (
                        <>
                          <span className="mx-1 text-amber-200">|</span>
                          <span className="text-amber-600 font-bold">{"$".repeat(location.price_range)}</span>
                          <span className="text-[10px] ml-1 font-bold text-amber-600 uppercase">
                            ({location.price_range === 1 ? "< 10k FCFA" : location.price_range === 2 ? "10k-15k FCFA" : "15k-30k+ FCFA"})
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-moss-600 font-bold">
                    <Clock size={16} />
                    Ouvert actuellement
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap gap-4 mt-10 border-b border-stone-100 pb-10">
                <Button
                  variant={saved ? "primary" : "secondary"}
                  size="md"
                  className="rounded-2xl h-12 px-6"
                  icon={<Heart size={18} className={saved ? "fill-white" : ""} />}
                  onClick={() => toggleSaved(location.id)}
                >
                  {saved ? "Enregistré" : "Enregistrer"}
                </Button>
                <Button variant="secondary" size="md" className="rounded-2xl h-12" icon={<Share2 size={18} />}>
                  Partager
                </Button>
                <Button variant="secondary" size="md" className="rounded-2xl h-12" icon={<ExternalLink size={18} />}>
                  Itinéraire
                </Button>
              </div>

              {/* Description Section */}
              <div className="mt-12 space-y-6">
                <h2 className="font-display font-bold text-2xl text-stone-900">À propos de ce lieu</h2>
                <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-4">
                  <p className="text-lg">{location.description || "Aucune description détaillée pour le moment."}</p>
                </div>
              </div>

              {/* Detailed Reviews Section */}
              <div className="mt-20 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-2xl text-stone-900">Avis de la communauté</h2>
                  {user ? (
                    <Button variant="primary" size="sm" icon={<MessageSquare size={16} />} onClick={() => setShowReviewForm(true)}>
                      Donner mon avis
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => openAuthModal("login")}>
                      Connectez-vous pour noter
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {location.reviews && location.reviews.length > 0 ? (
                    location.reviews.map((review, i) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-base p-6 sm:p-8 space-y-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                              <User size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-stone-900">{review.profiles?.username || "Utilisateur"}</p>
                              <p className="text-xs text-stone-400 italic">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Note globale</span>
                            <div className="bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                              <StarRating rating={review.rating} size={14} className="!gap-0" />
                            </div>
                          </div>
                        </div>

                        {/* Tri-Rating Display */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-y border-stone-50">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-400">
                              <Utensils size={12} className="text-moss-500" /> Cuisine
                            </div>
                            <StarRating rating={review.rating_food || review.rating} size={13} className="!gap-0" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-400">
                              <User size={12} className="text-amber-500" /> Service
                            </div>
                            <StarRating rating={review.rating_service || review.rating} size={13} className="!gap-0" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-400">
                              <Layout size={12} className="text-purple-500" /> Décor
                            </div>
                            <StarRating rating={review.rating_decor || review.rating} size={13} className="!gap-0" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-moss-600 tracking-widest block">Retour d'expérience</span>
                          <p className="text-stone-700 leading-relaxed italic">
                            "{review.body}"
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 card-base bg-stone-50/50 border-dashed border-stone-200">
                      <MessageSquare size={32} className="text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500 font-medium">Aucun avis pour le moment</p>
                      <p className="text-stone-400 text-sm">Soyez le premier à partager votre expérience !</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-28 space-y-6"
            >
              {/* Detailed Info Card */}
              <div className="card-base p-8 space-y-8">
                <h3 className="font-display font-bold text-xl text-stone-900 border-b border-stone-50 pb-4">
                  Informations pratiques
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-moss-50 flex items-center justify-center flex-shrink-0 text-moss-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Localisation</p>
                      <p className="text-stone-700 font-medium">{location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Horaires</p>
                      <p className="text-stone-700 font-medium">Lun-Dim: 11:30 — 00:00</p>
                    </div>
                  </div>

                  {/* Publié par */}
                  {(() => {
                    const publisherName = location.profiles?.full_name || location.profiles?.username;
                    if (publisherName) {
                      return (
                        <div className="flex items-start gap-4 pt-4 border-t border-stone-50">
                          <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0 text-stone-400">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Publié par</p>
                            <p className="text-moss-600 font-bold">{publisherName}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div className="flex gap-3">
                  <input
                    type="file"
                    id="sidebar-photo-upload"
                    onChange={handleReviewPhotoUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    variant="primary"
                    className="w-full h-12 rounded-2xl"
                    icon={uploadingReview ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Camera size={18} />}
                    onClick={() => document.getElementById('sidebar-photo-upload')?.click()}
                    disabled={uploadingReview}
                  >
                    {uploadingReview ? "Envoi..." : "Ajouter des photos"}
                  </Button>
                </div>
              </div>

              {/* Map Preview */}
              <div className="card-base overflow-hidden relative h-64 group cursor-pointer shadow-soft hover:shadow-card transition-shadow">
                <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                  <div className="text-center space-y-2 group-hover:scale-110 transition-transform duration-500">
                    <MapPin size={32} className="text-stone-300 mx-auto" />
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Carte Interactive</p>
                    <Badge variant="soft" color="#a8a29e" className="text-[10px]">Bientôt disponible</Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Review Form Overlay (Mockup) */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewForm(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-2xl text-stone-900">Donner mon avis</h3>
                <button onClick={() => setShowReviewForm(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block">Cuisine</label>
                    <StarRating 
                      rating={reviewData.rating_food} 
                      interactive 
                      size={20} 
                      className="!gap-0" 
                      onChange={(val) => setReviewData({...reviewData, rating_food: val, rating: Math.round((val + reviewData.rating_service + reviewData.rating_decor)/3)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block">Service</label>
                    <StarRating 
                      rating={reviewData.rating_service} 
                      interactive 
                      size={20} 
                      className="!gap-0" 
                      onChange={(val) => setReviewData({...reviewData, rating_service: val, rating: Math.round((reviewData.rating_food + val + reviewData.rating_decor)/3)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block">Décor</label>
                    <StarRating 
                      rating={reviewData.rating_decor} 
                      interactive 
                      size={20} 
                      className="!gap-0" 
                      onChange={(val) => setReviewData({...reviewData, rating_decor: val, rating: Math.round((reviewData.rating_food + reviewData.rating_service + val)/3)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block">Votre retour d'expérience</label>
                  <textarea
                    className="input-base min-h-[120px] pt-4"
                    placeholder="Racontez-nous votre visite..."
                    value={reviewData.body}
                    onChange={(e) => setReviewData({...reviewData, body: e.target.value})}
                  />
                </div>

                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={reviewFilesRef}
                    onChange={handleReviewPhotoUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    className="flex-1 rounded-2xl"
                    icon={uploadingReview ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-stone-400 border-t-transparent" /> : <Camera size={18} />}
                    onClick={() => reviewFilesRef.current?.click()}
                    disabled={uploadingReview}
                  >
                    {uploadingReview ? "Envoi..." : "Photos"}
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-2 rounded-2xl px-10" 
                    onClick={handleSubmitReview}
                    loading={uploadingReview}
                    disabled={!reviewData.body || uploadingReview}
                  >
                    Publier l'avis
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
