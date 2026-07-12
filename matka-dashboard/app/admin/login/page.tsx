"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white/95 backdrop-blur border border-white/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="h-14 w-14 rounded-full bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center text-2xl shadow-lg shadow-blue-900/30 mb-3">
          🔒
        </div>
        <h1 className="text-2xl font-bold text-center">
          <span className="text-blue-700">Satta Matka</span> Admin Login
        </h1>
        <p className="text-xs text-gray-500 mt-1">Sign in to manage the site</p>
      </div>

      {error && <div className="bg-red-100 border border-red-300 text-red-800 p-2 rounded mb-4 text-sm">{error}</div>}

      <label className="block mb-3">
        <span className="text-sm font-semibold text-gray-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          autoComplete="email"
        />
      </label>
      <label className="block mb-5">
        <span className="text-sm font-semibold text-gray-700">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          autoComplete="current-password"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md shadow-blue-900/30 disabled:opacity-50 transition"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-black px-4">
      <Suspense fallback={<div className="text-gray-300">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
