"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Heart,
  Settings,
  LogOut,
  Camera,
  User,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { LocationCard } from "@/components/molecules/LocationCard";
import { MOCK_LOCATIONS } from "@/types";
import { useStore } from "@/store/useStore";

const TABS = [
  { id: "places", label: "My Places", icon: MapPin },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProfilePage() {
  const { user, openAuthModal, signOut } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>("places");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-moss-50 flex items-center justify-center mx-auto mb-5">
            <User size={28} className="text-moss-500" />
          </div>
          <h1 className="font-display font-bold text-2xl text-stone-900 mb-2">
            Sign in required
          </h1>
          <p className="text-stone-500 mb-6">
            Log in to view your profile and contributions.
          </p>
          <Button variant="primary" onClick={() => openAuthModal("login")}>
            Log in
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-xl">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10"
        >
          <div className="relative group">
            <Avatar
              src={null}
              alt={user.email || "User"}
              size="lg"
              className="!w-20 !h-20 !text-xl"
            />
            <button className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={20} />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl text-stone-900">
              {user.user_metadata?.full_name || user.email?.split("@")[0] || "Foodie"}
            </h1>
            <p className="text-stone-500 text-sm">{user.email}</p>
            <p className="text-stone-400 text-xs mt-1">
              Member since {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={<LogOut size={15} />}
            onClick={signOut}
            className="text-red-500 hover:!bg-red-50"
          >
            Log out
          </Button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-stone-100 w-fit mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus-ring ${
                activeTab === tab.id
                  ? "bg-white text-stone-900 shadow-soft"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "places" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_LOCATIONS.slice(0, 3).map((loc, i) => (
                  <LocationCard key={loc.id} location={loc} index={i} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-stone-300" />
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900 mb-2">
                No saved locations yet
              </h3>
              <p className="text-stone-500 text-sm mb-5">
                Start exploring and save your favorite spots!
              </p>
              <Button variant="primary" size="sm">
                Explore Places
              </Button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-lg space-y-6">
              <div className="card-base p-6 space-y-4">
                <h3 className="font-display font-bold text-stone-900">
                  Account Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="input-base"
                      defaultValue={
                        user.user_metadata?.full_name || user.email?.split("@")[0]
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1.5">
                      Bio
                    </label>
                    <textarea
                      className="input-base textarea-base"
                      placeholder="Tell us about your food preferences…"
                      rows={3}
                    />
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>

              <div className="card-base p-6">
                <h3 className="font-display font-bold text-red-600 mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-stone-500 mb-4">
                  Once you delete your account, there is no going back.
                </p>
                <Button variant="ghost" size="sm" className="!text-red-500 hover:!bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
