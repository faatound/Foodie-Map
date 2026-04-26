"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, User } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-xl max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-moss-500 mb-3 block">
              Get in touch
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-stone-500 leading-relaxed mb-8">
              Have a question, suggestion, or just want to say hello? We&apos;d love
              to hear from you. Fill out the form and we&apos;ll get back to you
              as soon as possible.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@thefoodiemap.com",
                },
                {
                  icon: MessageSquare,
                  label: "Social",
                  value: "@thefoodiemap",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-moss-50 flex items-center justify-center">
                    <item.icon size={18} className="text-moss-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">{item.label}</p>
                    <p className="text-sm font-medium text-stone-700">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {submitted ? (
              <div className="card-base p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-moss-50 flex items-center justify-center mx-auto mb-5">
                  <Send size={24} className="text-moss-500" />
                </div>
                <h2 className="font-display font-bold text-2xl text-stone-900 mb-2">
                  Message Sent!
                </h2>
                <p className="text-stone-500 text-sm">
                  Thanks for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="card-base p-8 space-y-5"
              >
                <Input
                  label="Your Name"
                  placeholder="John Doe"
                  icon={<User size={16} />}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-stone-700">
                    Message
                  </label>
                  <textarea
                    className="input-base textarea-base focus-ring"
                    placeholder="Tell us what's on your mind…"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<Send size={16} />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
