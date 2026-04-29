"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, User, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/atoms/Avatar";
import { LocationCard } from "@/components/molecules/LocationCard";

export default function PublicProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndLocations = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        const { data: locationsData } = await supabase
          .from('locations')
          .select('*')
          .eq('user_id', id)
          .order('created_at', { ascending: false });

        if (locationsData) {
          setLocations(locationsData);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfileAndLocations();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-moss-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-4">
        <User className="w-16 h-16 text-stone-300 mb-4" />
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Foodie introuvable</h1>
        <p className="text-stone-500 mb-6">Ce profil n'existe pas ou a été supprimé.</p>
        <Link href="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-20">
      <div className="container-xl max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-moss-600 transition-colors mb-8 group font-medium text-sm">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Retour
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-stone-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <Avatar 
              src={profile.avatar_url} 
              alt={profile.full_name || "Foodie"} 
              size="lg" 
              className="w-24 h-24 sm:w-32 sm:h-32 shadow-md"
            />
            {profile.is_certified && (
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                <CheckCircle size={28} className="text-blue-500 fill-white" />
              </div>
            )}
          </div>
          <div className="flex-1 mt-2">
            <h1 className="font-display font-bold text-3xl text-stone-900 flex items-center justify-center sm:justify-start gap-2">
              {profile.full_name || "Foodie"}
            </h1>
            <p className="text-stone-500 font-medium mb-4">
              @{profile.username || profile.full_name?.replace(/\s/g, '').toLowerCase() || "user"}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-stone-600">
              <div className="bg-stone-100 px-4 py-2 rounded-xl flex items-center gap-2">
                <MapPin size={16} className="text-moss-500" />
                <span className="font-bold text-stone-900">{locations.length}</span> adresses partagées
              </div>
            </div>
          </div>
        </div>

        {/* User's Locations */}
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-900 mb-6">
            Les pépites de {profile.full_name?.split(' ')[0] || "ce foodie"}
          </h2>
          
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-100 shadow-sm">
              <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">Ce foodie n'a pas encore partagé d'adresses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
