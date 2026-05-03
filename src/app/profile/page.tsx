"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  MapPin,
  Camera,
  LogOut,
  Plus,
  Trash2,
  History,
  Heart,
  Star,
  CheckCircle,
  Edit2,
  Save,
  X
} from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LocationCard } from "@/components/molecules/LocationCard";
import { uploadAvatar } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

type TabId = "places" | "favorites";

export default function ProfilePage() {
  const { user, openAuthModal, signOut, savedIds } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>("places");
  const [uploading, setUploading] = useState(false);
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États pour l'édition de description
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [tempDesc, setTempDesc] = useState("");

  // États pour l'édition de profil
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: "",
    username: ""
  });

  // États pour le rognage
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Initialiser les données d'édition quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setEditData({
        full_name: user.user_metadata?.full_name || "",
        username: user.user_metadata?.username || user.email?.split('@')[0] || ""
      });
    }
  }, [user]);

  // Charger les lieux de l'utilisateur
  useEffect(() => {
    const fetchUserLocations = async () => {
      if (!user) return;
      setLoadingLocations(true);
      try {
        const { data, error } = await supabase
          .from("locations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setUserLocations(data || []);
      } catch (err) {
        console.error("Erreur lieux profil:", err);
      } finally {
        setLoadingLocations(false);
      }
    };

    if (activeTab === "places") {
      fetchUserLocations();
    }
  }, [user, activeTab]);

  // Charger les favoris
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || savedIds.size === 0) {
        setFavoriteLocations([]);
        return;
      }
      setLoadingFavorites(true);
      try {
        const ids = Array.from(savedIds);
        const { data, error } = await supabase
          .from("locations")
          .select("*")
          .in("id", ids);
        
        if (error) throw error;
        setFavoriteLocations(data || []);
      } catch (err) {
        console.error("Erreur favoris profil:", err);
      } finally {
        setLoadingFavorites(false);
      }
    };

    if (activeTab === "favorites") {
      fetchFavorites();
    }
  }, [user, activeTab, savedIds]);

  const handleUpdateDescription = async (id: string) => {
    try {
      setUploading(true);
      const { error } = await supabase
        .from("locations")
        .update({ description: tempDesc })
        .eq("id", id);
      
      if (error) throw error;
      
      setUserLocations(prev => prev.map(loc => loc.id === id ? { ...loc, description: tempDesc } : loc));
      setEditingLocId(null);
      alert("Description mise à jour !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setUploading(true);
      
      // 1. Base de données
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          full_name: editData.full_name,
          username: editData.username.replace(/\s/g, '').toLowerCase()
        });
      if (dbError) throw dbError;

      // 2. Auth Session
      const { data, error: authError } = await supabase.auth.updateUser({
        data: { 
          full_name: editData.full_name,
          username: editData.username.replace(/\s/g, '').toLowerCase()
        }
      });
      if (authError) throw authError;

      // Mettre à jour le store localement au lieu de recharger
      if (data.user) {
        useStore.getState().setUser(data.user);
      }

      setIsEditing(false);
      alert("Profil mis à jour !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageToCrop(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCroppedImage = async () => {
    if (!imageToCrop || !user) return;
    try {
      setUploading(true);
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (!croppedImageBlob) throw new Error("Erreur de rognage");

      const croppedFile = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
      const publicUrl = await uploadAvatar(user.id, croppedFile);
      
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl });
      const { data } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      
      // Mettre à jour le store localement
      if (data.user) {
        useStore.getState().setUser(data.user);
      }
      
      setImageToCrop(null);
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce lieu définitivement ?")) return;
    try {
      const { error, count } = await supabase
        .from("locations")
        .delete({ count: 'exact' })
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      if (count === 0) {
        throw new Error("Vous n'avez pas la permission de supprimer ce lieu.");
      }

      setUserLocations(prev => prev.filter(loc => loc.id !== id));
      alert("Lieu supprimé !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  // Charger le profil complet pour la certification
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Button onClick={() => openAuthModal("login")}>Se connecter</Button>
      </div>
    );
  }

  const isCertified = profile?.is_certified || false;
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Foodie";
  const displayHandle = user.user_metadata?.username || displayName.toLowerCase().replace(/\s/g, '');

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* En-tête */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-stone-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-md ${uploading ? 'opacity-50' : ''}`}>
                <Avatar src={user.user_metadata?.avatar_url} className="w-full h-full rounded-none" alt={displayName} />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={24} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} accept="image/*" />
              {isCertified && (
                <div className="absolute -bottom-2 -right-2 bg-moss-500 text-white p-1 rounded-lg border-2 border-white">
                  <CheckCircle size={14} />
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <div className="space-y-4 max-w-sm mx-auto md:mx-0">
                  <input 
                    className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-moss-500 outline-none font-bold"
                    value={editData.full_name}
                    placeholder="Nom complet"
                    onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-stone-400 font-bold">@</span>
                    <input 
                      className="w-full p-3 pl-8 rounded-xl border border-stone-200 focus:ring-2 focus:ring-moss-500 outline-none text-moss-600 font-bold"
                      value={editData.username}
                      placeholder="Identifiant"
                      onChange={(e) => setEditData({...editData, username: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={handleSaveProfile} icon={<Save size={16} />}>Enregistrer</Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} icon={<X size={16} />}>Annuler</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-stone-900">{displayName}</h1>
                    {isCertified && (
                      <span className="px-2 py-0.5 bg-moss-50 text-moss-700 text-[10px] font-black uppercase rounded-full border border-moss-200">
                        Certifié
                      </span>
                    )}
                    <button onClick={() => setIsEditing(true)} className="p-2 text-stone-400 hover:text-moss-600 transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <p className="text-moss-600 font-bold mb-6">@{displayHandle}</p>
                  
                  <div className="flex gap-3 justify-center md:justify-start">
                    <Link href="/add-location">
                      <Button variant="primary" icon={<Plus size={18} />}>Ajouter un lieu</Button>
                    </Link>
                    <Button variant="ghost" onClick={signOut} icon={<LogOut size={18} />} className="text-red-500">Quitter</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-2xl w-fit mb-8">
          {[
            { id: "places", label: "Mes Lieux", icon: MapPin },
            { id: "favorites", label: "Favoris", icon: Heart }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="min-h-[400px]">
          {activeTab === "places" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userLocations.map(loc => (
                <div key={loc.id} className="relative group bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
                  <LocationCard location={loc} />
                  
                  {/* Actions contextuelles */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <button 
                      onClick={() => {
                        setEditingLocId(loc.id);
                        setTempDesc(loc.description || "");
                      }}
                      className="p-2.5 bg-white text-stone-900 rounded-xl shadow-xl hover:bg-stone-50"
                      title="Modifier la description"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="p-2.5 bg-red-500 text-white rounded-xl shadow-xl hover:bg-red-600"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Formulaire d'édition de description en overlay */}
                  <AnimatePresence>
                    {editingLocId === loc.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 z-30 rounded-3xl p-6 flex flex-col"
                      >
                        <h4 className="font-bold text-stone-900 mb-4">Modifier la description</h4>
                        <textarea 
                          className="flex-1 w-full p-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-moss-500 outline-none text-sm resize-none"
                          value={tempDesc}
                          onChange={(e) => setTempDesc(e.target.value)}
                        />
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="primary" 
                            className="flex-1" 
                            size="sm"
                            onClick={() => handleUpdateDescription(loc.id)}
                            loading={uploading}
                          >
                            Enregistrer
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingLocId(null)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {userLocations.length === 0 && !loadingLocations && (
                <div className="text-center py-20 col-span-2 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                   <p className="text-stone-400 font-bold mb-4">Vous n'avez pas encore partagé de lieu.</p>
                   <Link href="/add-location"><Button variant="primary">Partager mon premier spot</Button></Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favoriteLocations.map(loc => (
                <LocationCard key={loc.id} location={loc} />
              ))}
              {favoriteLocations.length === 0 && !loadingFavorites && (
                <div className="text-center py-20 col-span-2 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                   <p className="text-stone-400 font-bold mb-2">Aucun favori pour le moment.</p>
                   <p className="text-stone-400 text-sm mb-6">Cliquez sur le cœur d'un lieu pour l'enregistrer ici.</p>
                   <Link href="/"><Button variant="secondary">Explorer les lieux</Button></Link>
                </div>
              )}
              {loadingFavorites && (
                <div className="col-span-2 flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-moss-500 border-t-transparent" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de rognage */}
      <AnimatePresence>
        {imageToCrop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-xl flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-stone-900">Ajuster votre photo</h3>
                <button onClick={() => setImageToCrop(null)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative h-[400px] w-full bg-stone-900">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold text-stone-400 uppercase tracking-widest">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-moss-500"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1" onClick={() => setImageToCrop(null)}>
                    Annuler
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1" 
                    onClick={handleSaveCroppedImage}
                    loading={uploading}
                  >
                    Confirmer
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
