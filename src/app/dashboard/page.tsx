"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  User,
  Globe,
  LogOut,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface DashboardData {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  email: string | null;
}

function QuickLink({
  href,
  icon: Icon,
  label,
  description,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  badge?: number;
}) {
  return (
    <a
      href={href}
      className="gold-card p-5 flex items-start gap-4 group"
    >
      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
        <Icon className="w-5 h-5 text-purple-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-white">{label}</h3>
          {badge != null && badge > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-amber-500 text-[10px] font-bold text-white px-1">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </div>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>
    </a>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardData | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => {
        if (!r.ok) {
          router.push("/login");
          return null;
        }
        return r.json();
      }),
      fetch("/api/chat/unread")
        .then((r) => (r.ok ? r.json() : { totalUnread: 0 }))
        .catch(() => ({ totalUnread: 0 })),
    ])
      .then(([profileData, unreadData]) => {
        if (profileData && profileData.id) {
          setUser(profileData);
          setUnreadCount(unreadData?.totalUnread || 0);
        } else {
          router.push("/login");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-8">
        <div className="content-panel max-w-2xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="content-panel max-w-2xl mx-auto"
      >
        {/* User header */}
        <div className="flex items-center gap-4 mb-8">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-400/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl font-bold text-purple-300">
              {user.displayName[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">
              {user.displayName}
            </h1>
            <p className="text-amber-300 font-mono text-sm">
              {user.displayName}@Syncro-Link
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-2 mb-8">
          <QuickLink
            href="/chat"
            icon={MessageSquare}
            label="Chat"
            description="Messages and chat rooms"
            badge={unreadCount}
          />
          <QuickLink
            href="/registry"
            icon={User}
            label="My Profile"
            description="Edit your bio and details"
          />
          <QuickLink
            href="/world-grid"
            icon={Globe}
            label="World Grid"
            description="See all points of light"
          />
        </div>

        {/* Logout */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
