"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlowInput, { GlowTextarea } from "@/components/ui/GlowInput";
import GlowSelect from "@/components/ui/GlowSelect";
import GlowButton from "@/components/ui/GlowButton";
import PostCard from "@/components/feed/PostCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { COUNTRIES } from "@/lib/constants";
import type { PostWithUser } from "@/types";

interface UserProfile {
  id: string;
  displayName: string;
  country: string;
  region: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  contactInfo: string;
  bio: string;
  avatarUrl: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  posts: PostWithUser[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [form, setForm] = useState({
    displayName: "",
    country: "",
    region: "",
    city: "",
    latitude: "",
    longitude: "",
    contactInfo: "",
    bio: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then(async (res) => {
        if (!res.ok) {
          router.push(res.status === 401 ? "/login" : "/registry");
          return;
        }
        const data = await res.json();
        setProfile(data);
        setForm({
          displayName: data.displayName || "",
          country: data.country || "",
          region: data.region || "",
          city: data.city || "",
          latitude: data.latitude != null ? String(data.latitude) : "",
          longitude: data.longitude != null ? String(data.longitude) : "",
          contactInfo: data.contactInfo || "",
          bio: data.bio || "",
        });
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    if (!form.displayName.trim()) {
      setError("Display name is required");
      return;
    }
    if (!form.country) {
      setError("Country is required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      const data = await res.json();
      setProfile(data);
      setEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        displayName: profile.displayName || "",
        country: profile.country || "",
        region: profile.region || "",
        city: profile.city || "",
        latitude: profile.latitude != null ? String(profile.latitude) : "",
        longitude: profile.longitude != null ? String(profile.longitude) : "",
        contactInfo: profile.contactInfo || "",
        bio: profile.bio || "",
      });
    }
    setEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-8">
        <div className="content-panel max-w-4xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 sm:px-6 py-8">
        <div className="content-panel max-w-4xl mx-auto text-center py-12 text-white/40">
          <p className="text-lg font-medium">Could not load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="content-panel max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wider mb-3"
            style={{ fontFamily: "var(--font-space)" }}
          >
            My Light
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Your presence on the Syncro-Link grid. Edit your profile and see
            your Right Light posts.
          </p>
        </div>

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

        {/* Profile section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gold-card p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#8a6d00]/30 shadow-[0_0_30px_rgba(138,109,0,0.15)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                  {profile.displayName[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{profile.displayName}</h2>
                <p className="text-sm text-white/40">
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2 rounded-full bg-purple-700 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded-full text-white/60 hover:text-white/90 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <GlowInput
              label="Display Name *"
              placeholder="Your Syncro-Link name"
              value={form.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              disabled={!editing}
            />

            <GlowSelect
              label="Country *"
              placeholder="Select your country"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
              disabled={!editing}
            />

            <GlowInput
              label="Region or State"
              placeholder="Your region or state"
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
              disabled={!editing}
            />

            <GlowInput
              label="Closest city, town, village or hamlet"
              placeholder="Your nearest town"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              disabled={!editing}
            />

            <div className="grid grid-cols-2 gap-4">
              <GlowInput
                label="Latitude"
                placeholder="e.g. 40.7128"
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => update("latitude", e.target.value)}
                disabled={!editing}
              />
              <GlowInput
                label="Longitude"
                placeholder="e.g. -74.0060"
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => update("longitude", e.target.value)}
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white/90">
                Syncro-Link Network Name
              </label>
              <div className="gold-input px-4 py-3 text-amber-300 font-mono font-semibold">
                {form.displayName.trim() || "YourName"}@Syncro-Link
              </div>
              <p className="text-xs text-white/50">
                Members can reach you using this network name via the Chat
                system or by finding you on the World Grid.
              </p>
            </div>

            <GlowTextarea
              label="Additional Contact Info"
              placeholder="Email, Telegram, Signal, or however you'd like to connect..."
              value={form.contactInfo}
              onChange={(e) => update("contactInfo", e.target.value)}
              disabled={!editing}
            />

            <GlowTextarea
              label="Bio"
              placeholder="Share a bit about yourself..."
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              disabled={!editing}
              className="min-h-[180px]"
            />

            {editing && (
              <div className="flex justify-end pt-2">
                <GlowButton
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </GlowButton>
              </div>
            )}
          </div>
        </motion.div>

        {/* Posts section */}
        <div>
          <h2
            className="text-2xl font-bold tracking-wider mb-6"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Your Right Light Posts
          </h2>

          {profile.posts.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <p className="text-lg font-medium mb-1">No posts yet</p>
              <p className="text-sm">
                Head to{" "}
                <a
                  href="/right-light"
                  className="text-purple-700 hover:underline font-medium"
                >
                  The Right Light
                </a>{" "}
                to share your light!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {profile.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
