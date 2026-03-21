"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlowInput from "@/components/ui/GlowInput";
import GlowButton from "@/components/ui/GlowButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-8 min-h-[calc(100vh-140px)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="content-panel w-full max-w-md"
      >
        <h1
          className="text-3xl font-bold tracking-wider text-center mb-2"
          style={{ fontFamily: "var(--font-space)" }}
        >
          Sign In
        </h1>
        <p className="text-white/50 text-sm text-center mb-8">
          Welcome back to the grid
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <GlowInput
            label="Email"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <GlowInput
            label="Password"
            placeholder="Your password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <GlowButton
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password}
            variant="violet"
          >
            {loading ? "Signing in..." : "Sign In"}
          </GlowButton>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Not registered yet?{" "}
          <a
            href="/registry"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Join the Grid
          </a>
        </p>
      </motion.div>
    </div>
  );
}
