"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useStore } from '@/lib/store';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const login = useStore((s) => s.login);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create User Document in Firestore
      // We use setDoc with the UID so it matches your security rules (allow write if auth.uid == userId)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user", // Default role
        createdAt: new Date().toISOString()
      });

      // 3. Update Local Store
      login({
        id: user.uid,
        email: user.email,
        role: "user"
      });

      // 4. Redirect to Shop
      router.push('/shop');

    } catch (err: any) {
      console.error("Signup Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 bg-gradient-to-br from-primary-dark to-primary-darker p-6">
      <div className="w-full max-w-lg bg-primary-light/40 backdrop-blur rounded-3xl border border-accent-gold/20 p-8 md:p-10 shadow-xl">
        <h1 className="text-3xl font-extrabold text-accent-gold mb-2">Create Account</h1>
        <p className="text-sm text-gray-300 mb-6">Join Waheed Fragrance today</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-transparent border border-accent-gold/20 focus:border-accent-gold outline-none text-white transition-colors"
            />
          </label>

          <label className="block text-sm text-gray-300">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="At least 6 characters"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-transparent border border-accent-gold/20 focus:border-accent-gold outline-none text-white transition-colors"
            />
          </label>

          <label className="block text-sm text-gray-300">
            Confirm Password
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              type="password"
              placeholder="Confirm your password"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-transparent border border-accent-gold/20 focus:border-accent-gold outline-none text-white transition-colors"
            />
          </label>

          {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20">{error}</div>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gold text-primary-dark font-bold py-3.5 rounded-lg hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-gold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
