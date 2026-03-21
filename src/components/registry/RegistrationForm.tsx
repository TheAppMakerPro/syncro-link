"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Pencil, Trash2 } from "lucide-react";
import GlowInput, { GlowTextarea } from "@/components/ui/GlowInput";
import GlowSelect from "@/components/ui/GlowSelect";
import GlowButton from "@/components/ui/GlowButton";
import { COUNTRIES } from "@/lib/constants";

const registerSteps = [
  "Identity & Location",
  "Contact & Bio",
  "Your Light",
  "First Right Light Post",
];

const editSteps = [
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
  const [locating, setLocating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const steps = isEditing ? editSteps : registerSteps;

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
            displayName: data.displayName || "",
            country: data.country || "",
            region: data.region || "",
            city: data.city || "",
            latitude: data.latitude != null ? String(data.latitude) : "",
            longitude: data.longitude != null ? String(data.longitude) : "",
            contactInfo: data.contactInfo || "",
            bio: data.bio || "",
            firstPostContent: "",
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
    if (step === 0) return form.displayName.trim() && form.country;
    if (!isEditing && step === 3) return form.firstPostContent.trim();
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
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          country: form.country,
          region: form.region,
          city: form.city,
          latitude: form.latitude,
          longitude: form.longitude,
          contactInfo: form.contactInfo,
          bio: form.bio,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
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
        <div className="text-black/60 animate-pulse font-medium">Loading...</div>
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
              <p className="text-black text-sm leading-relaxed">
                {isEditing
                  ? "Update your identity and location details below."
                  : "We only ask four things of you. We don\u0027t particularly need or want your actual legal name or physical address. If you want to give that, fine. But we\u0027re not asking for it."}
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
                <p className="text-xs text-black">
                  Use the auto-detect button above, or enter coordinates manually
                  from Google Earth to show up precisely on the World Grid map.
                </p>
              </div>
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
                {isEditing
                  ? "Update your profile image."
                  : "Upload a profile image that represents your light. This is optional but helps others connect with you."}
              </p>
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

          {!isEditing && step === 3 && (
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
                  className="px-5 py-2 rounded-full text-sm font-medium text-black/60 hover:text-black transition-colors"
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
