"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, ChefHat } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, setSession } =
    useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLogin = authModalMode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        setSession(data.session);
        closeAuthModal();
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              username: username.replace(/^@/, '')
            },
          },
        });
        if (err) throw err;

        // Créer immédiatement le profil dans public.profiles
        // (nécessaire pour la contrainte FK lors de l'ajout de lieux)
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: name,
            username: username.replace(/^@/, '').toLowerCase() || name.toLowerCase().replace(/\s+/g, '_'),
            avatar_url: null,
          }, { onConflict: "id" });
        }

        if (data.session) {
          setSession(data.session);
          closeAuthModal();
        } else {
          setSuccess("Vérifiez vos emails pour confirmer votre compte !");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError("");
    setSuccess("");
    openAuthModal(isLogin ? "signup" : "login");
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeAuthModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors z-10 focus-ring"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Header gradient */}
              <div className="h-2 bg-gradient-to-r from-moss-500 via-amber-400 to-rust-400" />

              <div className="p-8">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-moss-500 to-moss-400 flex items-center justify-center">
                    <ChefHat size={20} className="text-white" />
                  </div>
                  <span className="font-display font-bold text-xl text-stone-900">
                    The Foodie Map
                  </span>
                </div>

                <h2 className="text-center font-display font-bold text-2xl text-stone-900 mb-1">
                  {isLogin ? "Bon retour parmi nous" : "Créez votre compte"}
                </h2>
                <p className="text-center text-sm text-stone-500 mb-8">
                  {isLogin
                    ? "Connectez-vous pour partager vos adresses préférées"
                    : "Rejoignez la communauté des gourmets dès aujourd'hui"}
                </p>

                {/* Error / Success */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                    {success}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <Input
                        label="Nom"
                        type="text"
                        placeholder="Jean"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<User size={16} />}
                        required
                      />
                      <Input
                        label="Identifiant (@)"
                        type="text"
                        placeholder="jean_d"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<User size={16} />}
                        required
                      />
                    </>
                  )}

                  <Input
                    label="Email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={16} />}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Mot de passe"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock size={16} />}
                      required
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] text-stone-400 hover:text-stone-600 transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !mt-6"
                    loading={loading}
                  >
                    {isLogin ? "Connexion" : "Créer le compte"}
                  </Button>
                </form>

                {/* Toggle */}
                <p className="mt-6 text-center text-sm text-stone-500">
                  {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}{" "}
                  <button
                    onClick={toggleMode}
                    className="text-moss-600 font-semibold hover:text-moss-700 transition-colors focus-ring"
                  >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
