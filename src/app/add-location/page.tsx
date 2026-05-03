"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Upload, ChevronRight, ImagePlus, X, Check } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { CATEGORIES } from "@/types";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { uploadReviewPhoto } from "@/lib/storage";

export default function AddLocationPage() {
  const { user, openAuthModal } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "",
    description: "",
    price_range: 2, // Par défaut : budget moyen
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
     try {
       if (!event.target.files || event.target.files.length === 0) return;
       if (!user) return;
       
       setUploading(true);
       const files = Array.from(event.target.files);
       
       const uploadPromises = files.map(file => uploadReviewPhoto("new-spot", user.id, file));
       const urls = await Promise.all(uploadPromises);
       
       setUploadedPhotos(prev => [...prev, ...urls]);
       
     } catch (error: any) {
       alert("Erreur d'upload: " + error.message);
     } finally {
       setUploading(false);
     }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-4 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm card-base p-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-moss-50 flex items-center justify-center mx-auto mb-5">
            <MapPin size={28} className="text-moss-500" />
          </div>
          <h1 className="font-display font-bold text-2xl text-stone-900 mb-2">
            Connexion requise
          </h1>
          <p className="text-stone-500 mb-6">
            Vous devez être connecté pour partager une nouvelle adresse.
          </p>
          <Button variant="primary" onClick={() => openAuthModal("login")} className="w-full">
            Se connecter pour continuer
          </Button>
        </motion.div>
      </div>
    );
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      // Garantir que le profil existe avant d'insérer le lieu (fix FK constraint)
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Foodie",
        username: user.user_metadata?.username || user.email?.split('@')[0]?.toLowerCase() || "foodie",
      }, { onConflict: "id" });

      const { error } = await supabase.from("locations").insert([
        {
          name: formData.name,
          address: formData.address,
          category: formData.category,
          description: formData.description,
          price_range: formData.price_range,
          images: uploadedPhotos,
          user_id: user.id,
          rating: 0,
          reviews_count: 0,
        },
      ]);

      if (error) throw error;

      alert("🎉 Félicitations ! Votre lieu a été ajouté avec succès.");
      router.push("/"); // Redirection fluide sans recharger la page
      
    } catch (error: any) {
      alert("Erreur lors de l'enregistrement: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-stone-50/50">
      <div className="container-xl max-w-2xl">
        {/* Fil d'ariane */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-8 font-medium">
          <Link href="/" className="hover:text-moss-600 transition-colors">
            Accueil
          </Link>
          <ChevronRight size={14} />
          <span className="text-stone-800">Ajouter un lieu</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-base p-8 sm:p-12"
        >
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight mb-2">
            Partagez une nouvelle pépite
          </h1>
          <p className="text-stone-500 mb-10">
            Aidez la communauté à découvrir les meilleurs spots de Dakar.
          </p>

          {/* Barre de progression */}
          <div className="flex gap-3 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-moss-500 shadow-sm" : "bg-stone-200"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Informations de base
                </h2>

                <Input
                  label="Nom de l'établissement"
                  placeholder="ex: Le Petit Bistro"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="rounded-2xl"
                  required
                />

                <Input
                  label="Adresse exacte"
                  placeholder="Quartier, rue..."
                  icon={<MapPin size={16} />}
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="rounded-2xl"
                  required
                />

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">
                    Gamme de prix (Budget)
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, price_range: val }))}
                        className={`flex-1 p-4 rounded-2xl border transition-all text-center focus-ring ${
                          formData.price_range === val
                            ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <span className={`font-bold ${formData.price_range === val ? "text-amber-700" : "text-stone-400"}`}>
                          {"💰".repeat(val)}
                        </span>
                        <span className="block text-[10px] mt-1 font-bold text-stone-400 uppercase leading-tight">
                          {val === 1 ? "< 10.000 FCFA" : val === 2 ? "10k - 15k FCFA" : "15k - 30k+ FCFA"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">
                    Catégorie
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => updateField("category", cat.slug)}
                        className={`p-4 rounded-2xl border text-left transition-all text-sm focus-ring ${
                          formData.category === cat.slug
                            ? "border-moss-400 bg-moss-50 ring-2 ring-moss-200"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <span className="text-xl block mb-1">{cat.emoji}</span>
                        <span className="font-bold text-stone-800">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full h-14 rounded-2xl text-lg shadow-lg"
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.address || !formData.category}
                  >
                    Continuer
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Description & Photos
                </h2>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">
                    Pourquoi on aime ?
                  </label>
                  <textarea
                    className="input-base min-h-[120px] rounded-2xl pt-4"
                    placeholder="Ambiance, plats signatures, service..."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                {/* Zone d'upload réelle */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-stone-500 uppercase tracking-wider block">
                    Photos des lieux
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer bg-white group ${uploading ? 'border-moss-400 opacity-50' : 'border-stone-200 hover:border-moss-300'}`}
                  >
                    {uploading ? (
                      <div className="space-y-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-moss-500 border-t-transparent mx-auto" />
                        <p className="text-sm font-bold text-moss-600">Envoi en cours...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <ImagePlus size={32} className="text-stone-300" />
                        </div>
                        <p className="font-bold text-stone-700 mb-1">
                          Ajouter des photos
                        </p>
                        <p className="text-xs text-stone-400 italic">
                          Glissez-déposez vos images ici (Max 5Mo)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Galerie des photos uploadées */}
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 pt-4">
                      {uploadedPhotos.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                          <Image src={url} alt="Aperçu" fill className="object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => {
                               e.stopPropagation();
                               setUploadedPhotos(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-2xl h-14 px-8"
                    onClick={() => setStep(1)}
                  >
                    Retour
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1 rounded-2xl h-14 shadow-lg"
                    onClick={() => setStep(3)}
                  >
                    Continuer
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-moss-600">
                   <Check className="w-6 h-6" />
                   <h2 className="font-display font-bold text-xl">Récapitulatif</h2>
                </div>

                <div className="card-base p-8 space-y-4 bg-stone-50/50 border-stone-100 italic">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400 uppercase font-bold text-[10px] tracking-widest">Établissement</span>
                    <span className="text-stone-900 font-bold">
                      {formData.name}
                    </span>
                  </div>
                  <div className="h-px bg-stone-200/50" />
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400 uppercase font-bold text-[10px] tracking-widest">Adresse</span>
                    <span className="text-stone-900 font-bold truncate max-w-[200px]">
                      {formData.address}
                    </span>
                  </div>
                  <div className="h-px bg-stone-200/50" />
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400 uppercase font-bold text-[10px] tracking-widest">Catégorie</span>
                    <span className="text-stone-900 font-bold">
                      {CATEGORIES.find((c) => c.slug === formData.category)
                        ?.label || formData.category}
                    </span>
                  </div>
                  <div className="h-px bg-stone-200/50" />
                  <div className="text-sm">
                    <span className="text-stone-400 uppercase font-bold text-[10px] tracking-widest block mb-2">Description</span>
                    <p className="text-stone-600 leading-relaxed">{formData.description || "Aucune description fournie."}</p>
                  </div>
                  {uploadedPhotos.length > 0 && (
                    <div className="pt-2">
                       <span className="text-stone-400 uppercase font-bold text-[10px] tracking-widest block mb-2">{uploadedPhotos.length} Photos ajoutées</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-2xl h-14 px-8"
                    onClick={() => setStep(2)}
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 rounded-2xl h-14 shadow-moss shadow-lg"
                    icon={submitting ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Upload size={20} />}
                    disabled={submitting}
                  >
                    {submitting ? "Enregistrement..." : "Publier l'adresse"}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
