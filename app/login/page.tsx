"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Enter your email first");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError(null);
      setLoading(false);
      alert("Check your email for a magic link!");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chem 121 Trainer</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Sign in to continue practicing
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-text-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-text outline-none focus:border-accent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-secondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-text outline-none focus:border-accent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-err">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-3 font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={handleMagicLink}
          disabled={loading}
          className="w-full rounded-lg border border-border bg-bg-card py-3 font-medium text-text transition hover:bg-bg-elevated disabled:opacity-50"
        >
          Send magic link
        </button>

        <p className="text-center text-sm text-text-secondary">
          No account?{" "}
          <a href="/signup" className="text-accent hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
