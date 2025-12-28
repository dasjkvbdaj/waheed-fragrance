"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

// --- NEW IMPORTS START ---
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
// --- NEW IMPORTS END ---

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useStore((s) => s.login);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    // 1. LOGIN TO FIREBASE SDK
    await signInWithEmailAndPassword(auth, email, password);

    // 2. LOGIN TO SERVER API
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data?.error || 'Invalid credentials');
    }

    // 3. Save user in client store
    login(data.user);

    // 4. Redirect based on role
    const role = (data.user.role || '').toUpperCase();
    if (role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/shop');
    }

  } catch (err: any) {
    // This console log is for YOU (the developer), the user won't see it on the screen
    console.error("Login Error:", err.code); 

    // --- FIX IS HERE ---
    // Check for 'auth/invalid-credential' which covers both wrong password and user not found
    if (
      err.code === 'auth/invalid-credential' || 
      err.code === 'auth/user-not-found' || 
      err.code === 'auth/wrong-password'
    ) {
      setError('Invalid credentials');
    } else {
      // Fallback for network errors or other issues
      setError('Failed to login. Please check your connection.');
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 bg-gradient-to-br from-primary-dark to-primary-darker p-6">
      <div className="w-full max-w-lg bg-primary-light/40 backdrop-blur rounded-3xl border border-accent-gold/20 p-8 md:p-10 shadow-xl">
        <h1 className="text-3xl font-extrabold text-accent-gold mb-2">Welcome back</h1>
        <p className="text-sm text-gray-300 mb-6">Sign in to continue to Waheed Fragrance</p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-transparent border border-accent-gold/20 focus:border-accent-gold outline-none text-white"
            />
          </label>

          <label className="block text-sm text-gray-300">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="password"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-transparent border border-accent-gold/20 focus:border-accent-gold outline-none text-white"
            />
          </label>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex items-center justify-between gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent-gold text-primary-dark font-semibold py-3 rounded-lg hover:brightness-95 transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
