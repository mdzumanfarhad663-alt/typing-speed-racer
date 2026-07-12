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
      className="bg-white/95 backdrop-blur border border-white/20 rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl"
    >
      <div className="flex flex-col items-center mb-5 sm:mb-6">
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center mb-3">
          <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />
          <span className="absolute inset-1 rounded-full bg-blue-500/30 animate-pulse" />
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z"
                fill="#facc15"
                stroke="#eab308"
                strokeWidth="0.5"
              />
              <rect x="9" y="11" width="6" height="5" rx="1" fill="#1e3a8a" />
              <path d="M10 11V9.5a2 2 0 1 1 4 0V11" stroke="#1e3a8a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          <span className="text-blue-700">Satta Matka</span> Admin Login
        </h1>
        <p className="text-xs text-gray-500 mt-1 text-center">Sign in to manage the site</p>
      </div>

      {error && <div className="bg-red-100 border border-red-300 text-red-800 p-2 rounded mb-4 text-sm">{error}</div>}

      <label className="block mb-3">
        <span className="text-sm font-semibold text-gray-700">Secret IP</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="192.168.1.15"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          autoComplete="email"
        />
      </label>
      <label className="block mb-5">
        <span className="text-sm font-semibold text-gray-700">Secret Access Key</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="10 password"
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
        {busy ? "Accessing…" : "Access"}
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
