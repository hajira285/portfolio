
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#101827] p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
      >
        <div className="mb-7 text-center">
          <div className="text-4xl mb-3">🌿</div>
          <h1 className="text-3xl font-bold text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage your portfolio
          </p>
        </div>

        <label className="mb-2 block text-sm text-gray-300">
          Admin Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your admin password"
          required
          className="w-full rounded-xl border border-white/15 bg-black/20 p-4 text-white outline-none focus:border-emerald-400"
        />

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-emerald-500 p-4 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login to Dashboard"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 w-full text-sm text-gray-400 hover:text-white"
        >
          ← Back to Portfolio
        </button>
      </form>
    </main>
  );
}
