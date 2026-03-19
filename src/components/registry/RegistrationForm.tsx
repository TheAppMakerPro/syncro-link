"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import GlowInput, { GlowTextarea } from "@/components/ui/GlowInput";
import GlowSelect from "@/components/ui/GlowSelect";
import GlowButton from "@/components/ui/GlowButton";
import { COUNTRIES } from "@/lib/constants";

const steps = [
  "Identity & Location",
  "Contact & Bio",
  "Your Light",
  "First Right Light Post",
];

export default function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    displayName: "",
    country: "",
    region: "",
    city: "",
    latitude: "",
    longitude: "",
    contactInfo: "",
    bio: "",
    firstPostContent: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const canProceed = () => {
    if (step === 0) return form.displayName.trim() && form.country;
    if (step === 3) return form.firstPostContent.trim();
    return true;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.displayName.trim() || !form.country || !form.firstPostContent.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      if (avatar) fd.append("avatar", avatar);

      const res = await fetch("/api/users", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      router.push("/world-grid");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${
                i === step
                  ? "bg-purple-700 text-white shadow-lg shadow-purple-700/30"
                  : i < step
                  ? "bg-purple-200 text-purple-800 cursor-pointer hover:bg-purple-300"
                  : "bg-black/5 text-black/30"
              }`}
            >
              {i + 1}
            </button>
            {i < steps.length - 1 && (
              <div
                className={`hidden sm:block w-10 h-0.5 rounded-full ${
                  i < step ? "bg-purple-400" : "bg-black/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-sm font-semibold text-black/60 mb-6">{steps[step]}</p>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {step === 0 && (
            <>
              <p className="text-black text-sm leading-relaxed">
                We only ask four things of you. We don&apos;t particularly need or want
                your actual legal name or physical address. If you want to give that,
                fine. But we&apos;re not asking for it.
              </p>
              <GlowInput
                label="What would you like others to know you by? *"
                placeholder="Your Syncro-Link name"
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
              />
              <GlowSelect
                label="Country *"
                placeholder="Select your country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                options={COUNTRIES.map((c) => ({ value: c, label: c }))}
              />
              <GlowInput
                label="Region or State"
                placeholder="Your region or state"
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
              />
              <GlowInput
                label="Closest city, town, village or hamlet"
                placeholder="Your nearest town"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <GlowInput
                  label="Latitude (optional)"
                  placeholder="e.g. 40.7128"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => update("latitude", e.target.value)}
                />
                <GlowInput
                  label="Longitude (optional)"
                  placeholder="e.g. -74.0060"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => update("longitude", e.target.value)}
                />
              </div>
              <p className="text-xs text-black">
                Go to Google Earth and figure out your exact latitude and longitude
                to show up precisely on the World Grid map.
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <GlowTextarea
                label="Contact Me — share however you'd like others to reach you"
                placeholder="Email, Telegram, Signal, or however you'd like to connect..."
                value={form.contactInfo}
                onChange={(e) => update("contactInfo", e.target.value)}
              />
              <GlowTextarea
                label="Your Mini Bio — introduce yourself to the community"
                placeholder="Share a bit about yourself, your journey, what lights you up..."
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                className="min-h-[180px]"
              />
              <p className="text-xs text-black">
                Everything goes but capitalism. Please always respect the three
                sovereign rules of Syncro-Link. No Capitalism. No Bad Actors. No
                Doom and Gloom.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-black text-sm">
                Upload a profile image that represents your light. This is optional
                but helps others connect with you.
              </p>
              <div className="flex flex-col items-center gap-6">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-[#8a6d00]/30 shadow-[0_0_30px_rgba(138,109,0,0.15)]"
                    />
                    <button
                      onClick={() => {
                        setAvatar(null);
                        setAvatarPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-black/15 p-10 hover:border-purple-500/40 hover:bg-purple-50/30 transition-colors w-full max-w-sm">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-black" />
                    </div>
                    <span className="text-black text-sm">Click to upload image</span>
                    <span className="text-black text-xs">JPG, PNG, WebP, GIF — up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 mb-4">
                <p className="text-black text-sm leading-relaxed">
                  You must make at least one positive post to the RIGHT LIGHT in
                  order to show up on the Syncro-Link index world grid map. NO
                  MATTER HOW SIMPLE OR ELABORATE.
                </p>
              </div>
              <GlowTextarea
                label="Your First Right Light Post *"
                placeholder="Share something positive that has happened to you, somebody else, or the planet. Let there be light..."
                value={form.firstPostContent}
                onChange={(e) => update("firstPostContent", e.target.value)}
                className="min-h-[200px]"
              />
              <p className="text-xs text-black">
                Use #hashtags so others can find your post by topic. Keep it light
                filled and joyful!
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-black/60 hover:text-black transition-colors disabled:opacity-20 disabled:cursor-not-allowed font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-700 text-white font-semibold hover:bg-purple-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <GlowButton
            type="button"
            onClick={handleSubmit}
            disabled={loading || !canProceed()}
          >
            {loading ? "Registering..." : "Join the Grid"}
          </GlowButton>
        )}
      </div>
    </div>
  );
}
