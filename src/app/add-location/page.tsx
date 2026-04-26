"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Upload, ChevronRight, ImagePlus } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { CATEGORIES } from "@/types";
import { useStore } from "@/store/useStore";
import Link from "next/link";

export default function AddLocationPage() {
  const { user, openAuthModal } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "",
    description: "",
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-moss-50 flex items-center justify-center mx-auto mb-5">
            <MapPin size={28} className="text-moss-500" />
          </div>
          <h1 className="font-display font-bold text-2xl text-stone-900 mb-2">
            Sign in required
          </h1>
          <p className="text-stone-500 mb-6">
            You need to be logged in to add a new place.
          </p>
          <Button variant="primary" onClick={() => openAuthModal("login")}>
            Log in to continue
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
    // Would submit to Supabase
    alert("Location submitted! (Demo mode — Supabase integration required)");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-xl max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-8">
          <Link href="/" className="hover:text-moss-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-stone-800 font-medium">Add a Place</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-bold text-3xl text-stone-900 tracking-tight mb-2">
            Add a New Place
          </h1>
          <p className="text-stone-500 mb-8">
            Share your favorite culinary discovery with fellow food lovers.
          </p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s <= step ? "bg-moss-500" : "bg-stone-200"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Basic Details
                </h2>

                <Input
                  label="Place Name"
                  placeholder="e.g. Le Petit Bistro"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />

                <Input
                  label="Address"
                  placeholder="Full address…"
                  icon={<MapPin size={16} />}
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-stone-700">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => updateField("category", cat.slug)}
                        className={`p-3 rounded-xl border text-left transition-all text-sm focus-ring ${
                          formData.category === cat.slug
                            ? "border-moss-400 bg-moss-50 ring-2 ring-moss-200"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <span className="text-base mr-1.5">{cat.emoji}</span>
                        <span className="font-medium text-stone-800">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={
                    !formData.name || !formData.address || !formData.category
                  }
                >
                  Continue
                  <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Description & Photos
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-stone-700">
                    Description
                  </label>
                  <textarea
                    className="input-base textarea-base focus-ring"
                    placeholder="Tell us about this place…"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Photo upload zone */}
                <div className="border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center hover:border-moss-300 transition-colors cursor-pointer">
                  <ImagePlus size={32} className="text-stone-300 mx-auto mb-3" />
                  <p className="font-medium text-stone-700 text-sm mb-1">
                    Upload photos
                  </p>
                  <p className="text-xs text-stone-400">
                    Drag & drop or click to browse. Max 5MB per image.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    onClick={() => setStep(3)}
                  >
                    Continue
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="font-display font-bold text-xl text-stone-900">
                  Review & Submit
                </h2>

                <div className="card-base p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Name</span>
                    <span className="text-stone-900 font-medium">
                      {formData.name}
                    </span>
                  </div>
                  <div className="h-px bg-stone-100" />
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Address</span>
                    <span className="text-stone-900 font-medium">
                      {formData.address}
                    </span>
                  </div>
                  <div className="h-px bg-stone-100" />
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Category</span>
                    <span className="text-stone-900 font-medium">
                      {CATEGORIES.find((c) => c.slug === formData.category)
                        ?.label || formData.category}
                    </span>
                  </div>
                  {formData.description && (
                    <>
                      <div className="h-px bg-stone-100" />
                      <div className="text-sm">
                        <span className="text-stone-500 block mb-1">Description</span>
                        <span className="text-stone-700">{formData.description}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    icon={<Upload size={16} />}
                  >
                    Submit Place
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
