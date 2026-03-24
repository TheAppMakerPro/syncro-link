"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Pencil, Trash2 } from "lucide-react";
import GlowInput, { GlowTextarea } from "@/components/ui/GlowInput";
import GlowSelect from "@/components/ui/GlowSelect";
import GlowButton from "@/components/ui/GlowButton";
const FREQUENCY_TIERS = [
  {
    color: "#e8e8ff",
    name: "The White Star",
    label: "Base Color",
    description: "You do 3 sessions of six heart coherent breaths throughout each day. This takes 9 minutes and equals 18 frequency anchors set per day.",
    frequency: "3x/day \u00b7 9 minutes",
    gradient: "radial-gradient(circle, #ffffff, #e8e8ff, #c8c8ff60, transparent)",
    glow: "0 0 18px 6px rgba(255,255,255,0.7), 0 0 40px 14px rgba(200,200,255,0.3)",
  },
  {
    color: "#00cc66",
    name: "The Emerald Heart Crystal",
    label: "First Grounding",
    description: "You do 9 sessions of six heart coherent breaths throughout each day. This takes 27 minutes and equals 54 frequency anchors set per day.",
    frequency: "9x/day \u00b7 27 minutes",
    gradient: "radial-gradient(circle, #66ffaa, #00cc66, #00884440, transparent)",
    glow: "0 0 18px 6px rgba(0,204,102,0.6), 0 0 40px 14px rgba(0,136,68,0.25)",
  },
  {
    color: "#4488cc",
    name: "The Blue Sapphire Plasma",
    label: "Second Grounding",
    description: "You do 18 sessions of six heart coherent breaths throughout each day. This takes 54 minutes and equals 108 frequency anchors set per day.",
    frequency: "18x/day \u00b7 54 minutes",
    gradient: "radial-gradient(circle, #99ccff, #4488cc, #2255aa50, transparent)",
    glow: "0 0 18px 6px rgba(68,136,204,0.6), 0 0 40px 14px rgba(34,85,170,0.3)",
  },
  {
    color: "#9933cc",
    name: "The Violet Resurrection Flame",
    label: "Third Grounding",
    description: "You do 27 sessions of six heart coherent breaths throughout each day. This takes 81 minutes and equals 162 frequency anchors set per day.",
    frequency: "27x/day \u00b7 81 minutes",
    gradient: "radial-gradient(circle, #cc66ff, #9933cc, #6600994d, transparent)",
    glow: "0 0 18px 6px rgba(153,51,204,0.6), 0 0 40px 14px rgba(102,0,153,0.3)",
  },
  {
    color: "#daa520",
    name: "Golden Ground",
    label: "Golden Ground",
    description: "You spend your entire day in deep connection to the planet. Not pristine silence sitting upon a lotus deep connection. Just aware and present as a general base. You anchor whenever you feel like it, which seems like always.",
    frequency: "All day presence",
    gradient: "radial-gradient(circle, #ffe066, #daa520, #b8860b50, transparent)",
    glow: "0 0 18px 6px rgba(218,165,32,0.7), 0 0 40px 14px rgba(184,134,11,0.3)",
  },
];
import { COUNTRIES } from "@/lib/constants";

const STEPS = [
  "Identity & Location",
  "Contact & Bio",
  "Your Light",
];

export default function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    country: "",
    region: "",
    city: "",
    latitude: "",
    longitude: "",
    contactInfo: "",
    bio: "",
    markerColor: "#e8e8ff",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const steps = STEPS;

  // Check if user is already registered
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.id) {
          setIsEditing(true);
          setForm({
            email: data.email || "",
            password: "",
            displayName: data.displayName || "",
            country: data.country || "",
            region: data.region || "",
            city: data.city || "",
            latitude: data.latitude != null ? String(data.latitude) : "",
            longitude: data.longitude != null ? String(data.longitude) : "",
            contactInfo: data.contactInfo || "",
            bio: data.bio || "",
            markerColor: data.markerColor || "#e8e8ff",
          });
          setExistingAvatarUrl(data.avatarUrl || null);
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => {
        setError("Could not get your location. Please allow location access or enter manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const canProceed = () => {
    if (step === 0) {
      const base = form.displayName.trim() && form.country;
      if (isEditing) return base;
      return base && form.email.trim() && form.password.length >= 6;
    }
    return true;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async () => {
    if (!form.displayName.trim() || !form.country) {
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
        let msg = "Registration failed";
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {
          msg = `Server error (${res.status})`;
        }
        throw new Error(msg);
      }

      router.push("/world-grid");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.displayName.trim() || !form.country) {
      setError("Display name and country are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("displayName", form.displayName);
      fd.append("country", form.country);
      fd.append("region", form.region);
      fd.append("city", form.city);
      fd.append("latitude", form.latitude);
      fd.append("longitude", form.longitude);
      fd.append("contactInfo", form.contactInfo);
      fd.append("bio", form.bio);
      fd.append("markerColor", form.markerColor);
      if (avatar) fd.append("avatar", avatar);

      const res = await fetch("/api/profile", {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        let msg = "Update failed";
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {
          msg = `Server error (${res.status})`;
        }
        throw new Error(msg);
      }

      setSuccess("Your profile has been updated!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-white/60 animate-pulse font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Edit mode banner */}
      {isEditing && (
        <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-3 flex items-center gap-3">
          <Pencil className="w-4 h-4 text-purple-600 shrink-0" />
          <p className="text-purple-800 text-sm font-medium">
            You&apos;re already registered. Update your info below.
          </p>
        </div>
      )}

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
                  : "bg-white/5 text-white/30"
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

      <p className="text-center text-sm font-semibold text-white/60 mb-6">{steps[step]}</p>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm font-medium">
          {success}
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
              <p className="text-white/90 text-sm leading-relaxed">
                {isEditing
                  ? "Update your identity and location details below."
                  : "We (my offworld friends and I), all welcome you to the massive ascension platform of Syncro-Link."}
              </p>
              {isEditing ? (
                form.email && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold">Email</label>
                    <div className="gold-input px-4 py-3 text-white/50">{form.email}</div>
                  </div>
                )
              ) : (
                <>
                  <GlowInput
                    label="Email *"
                    placeholder="your@email.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  <GlowInput
                    label="Password *"
                    placeholder="Choose a password (min 6 characters)"
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </>
              )}
              <GlowInput
                label="Choose your Syncro-Link Network Name"
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
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleAutoLocate}
                  disabled={locating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  <MapPin className="w-4 h-4" />
                  {locating ? "Locating..." : "Auto-Detect My Location"}
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput
                    label="Latitude"
                    placeholder="e.g. 29.4241"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => update("latitude", e.target.value)}
                  />
                  <GlowInput
                    label="Longitude"
                    placeholder="e.g. -98.4936"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => update("longitude", e.target.value)}
                  />
                </div>
                <p className="text-xs text-white/60">
                  Use the auto-detect button above, or enter coordinates manually
                  from Google Earth to show up precisely on the World Grid map.
                </p>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">
                  Your Syncro-Link Network Name
                </label>
                <div className="gold-input px-4 py-3 text-amber-300 font-mono font-semibold">
                  {form.displayName.trim() || "YourName"}@Syncro-Link
                </div>
                <p className="text-xs text-white/50">
                  You can direct message any member of the collective index by
                  locating them on the World Grid, then creating a chat room
                  and inviting them in by their Syncro-Link network name.
                </p>
              </div>
              <GlowTextarea
                label="Additional Contact Info (optional)"
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
              <p className="text-xs text-white/60">
                Everything goes but capitalism. Please always respect the three
                sovereign rules of Syncro-Link. No Capitalism. No Bad Actors. No
                Doom and Gloom.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-white/80 text-sm leading-relaxed space-y-3">
                <p>
                  The color of light you choose below will correspond to how
                  many times you consciously anchor frequency over the course
                  of each day. Tap or click on any color to see how many
                  conscious heart coherent breaths each represents.
                </p>
                <p>
                  This choice shows up on the world wide grid. Other members
                  can click or hover on your light there and see your bio and
                  network name to direct message you for local connection.
                </p>
                <p className="text-white/60">
                  There is no monitoring system. It&apos;s not a contest. Just
                  be honest. Setting more frequency anchors is not necessarily
                  better if you don&apos;t take the time to center, relax and
                  breathe with sincerity and pure intent.
                </p>
                <p className="text-white/60">
                  These are just markers. Gold is obviously for somebody who has
                  freed up a lot of their time so it is practical. If you work,
                  have a family don&apos;t push yourself. Remember it&apos;s not
                  a contest. It&apos;s just data.
                </p>
                <p className="text-white/60">
                  So choose your light based on your current availability and
                  change it whenever the frequency of your practice quickens or
                  adjusts. We do have an algorithm attached to the overall count
                  of world wide frequency anchors set for each day and you can
                  find it on the Anchorhythm page.
                </p>
                <p className="text-white/60">
                  And once again. Take it easy. It&apos;s not a contest. There
                  is no competition at hand. It&apos;s just data. So we can all
                  see how incredible we are.
                </p>
              </div>

              {/* Frequency tier spheres */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-white/90 text-center">
                  Choose Your Light
                </label>
                <p className="text-white/60 text-xs leading-relaxed text-center max-w-md mx-auto">
                  Syncro-Link is about the frequency of 5th Density light, which
                  is clarity, wisdom, stability and silent heart centered
                  presence. In the 5th density love is an actual force of
                  existence and manifests as multi dimensional formulas emitted
                  from your heart center that always provide for perfect
                  allowance.
                </p>
                <div className="flex justify-center gap-5 sm:gap-7 py-4">
                  {FREQUENCY_TIERS.map((tier, i) => (
                    <button
                      key={tier.color}
                      type="button"
                      onClick={() => update("markerColor", tier.color)}
                      className="group relative flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-transform duration-200 ${
                          form.markerColor === tier.color
                            ? "scale-125 ring-2 ring-white/40 ring-offset-2 ring-offset-transparent"
                            : "hover:scale-110"
                        }`}
                        style={{
                          background: tier.gradient,
                          boxShadow: tier.glow,
                          animation: `sphere-pulse ${2.5 + i * 0.3}s ease-in-out infinite`,
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* Selected tier info */}
                {(() => {
                  const selected = FREQUENCY_TIERS.find(
                    (t) => t.color === form.markerColor
                  );
                  if (!selected) return null;
                  return (
                    <div className="text-center space-y-1 animate-fade-in">
                      <p className="text-white/50 text-xs uppercase tracking-wider">
                        {selected.label}
                      </p>
                      <p className="text-white font-bold text-sm">
                        {selected.name}
                      </p>
                      <p className="text-white/50 text-xs">
                        {selected.frequency}
                      </p>
                      <p className="text-white/60 text-xs max-w-md mx-auto leading-relaxed">
                        {selected.description}
                      </p>
                    </div>
                  );
                })()}

                {/* Fallback if current color doesn't match any tier */}
                {!FREQUENCY_TIERS.find((t) => t.color === form.markerColor) && (
                  <p className="text-center text-white/40 text-xs">
                    Select one of the five frequencies above
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-6">
                {(avatarPreview || existingAvatarUrl) ? (
                  <div className="relative">
                    <img
                      src={avatarPreview || existingAvatarUrl!}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-[#8a6d00]/30 shadow-[0_0_30px_rgba(138,109,0,0.15)]"
                    />
                    <button
                      onClick={() => {
                        setAvatar(null);
                        setAvatarPreview(null);
                        setExistingAvatarUrl(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/20 p-10 hover:border-purple-500/40 hover:bg-purple-50/30 transition-colors w-full max-w-sm">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white/90" />
                    </div>
                    <span className="text-white/90 text-sm">Upload your bio pic here</span>
                    <span className="text-white/90 text-xs">JPG, PNG, WebP, GIF — up to 10MB</span>
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

        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white/60 hover:text-white/90 transition-colors disabled:opacity-20 disabled:cursor-not-allowed font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-700 text-white font-semibold hover:bg-purple-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : isEditing ? (
          <GlowButton
            type="button"
            onClick={handleUpdate}
            disabled={loading || !canProceed()}
          >
            {loading ? "Saving..." : "Save Changes"}
          </GlowButton>
        ) : (
          <GlowButton
            type="button"
            onClick={handleRegister}
            disabled={loading || !canProceed()}
          >
            {loading ? "Registering..." : "Join the Grid"}
          </GlowButton>
        )}
      </div>

      {/* Delete profile */}
      {isEditing && (
        <div className="mt-16 pt-8 border-t border-red-200">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete my profile
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
              <p className="text-red-700 text-sm font-medium">
                Are you sure? This will permanently remove your profile, all your posts, and your point of light from the map.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, delete everything"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-5 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white/90 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
