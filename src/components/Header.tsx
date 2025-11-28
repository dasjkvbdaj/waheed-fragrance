"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Header() {
  const items = useStore((state) => state.items);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full bg-primary-dark/95 backdrop-blur border-b border-accent-gold/20 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-accent-gold hover:text-yellow-400 transition">
          ✨ Waheed Fragrance
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {user?.role !== 'ADMIN' && (
            <>
              <Link href="/" className="hover:text-accent-gold transition">
                Home
              </Link>
              <Link href="/shop" className="hover:text-accent-gold transition">
                Shop
              </Link>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">Welcome, <span className="font-semibold text-white">{user.email}</span></span>

                {/* Admin sees the admin panel link */}
                {user.role === 'ADMIN' ? (
                  <a
                    href="/admin"
                    className="px-3 py-2 bg-gradient-to-r from-accent-gold/90 to-yellow-400 text-primary-dark rounded-lg font-semibold shadow-sm hover:opacity-95 transition text-sm"
                  >
                    Admin Panel
                  </a>
                ) : null}

                <button
                  onClick={() => {
                    try { logout(); } catch { /* ignore */ }
                    // force a full reload to land on a clean /login and ensure CSS/global styles are applied
                    try { window.location.assign('/login'); } catch { router.push('/login'); }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transform transition text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block text-sm text-gray-300 hover:text-white">
              Login
            </Link>
          )}

          {user?.role !== 'ADMIN' && (
            <Link
              href="/cart"
              className="relative p-2 hover:bg-primary-light rounded-lg transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-gold text-primary-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {/* Mobile Menu Button - Only show if not admin or if we want mobile menu for admin too (maybe just logout) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-primary-light rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-darker border-t border-accent-gold/20">
          <nav className="flex flex-col gap-4 px-4 py-4">
            {user?.role !== 'ADMIN' && (
              <>
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-accent-gold transition"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-accent-gold transition"
                >
                  Shop
                </Link>
              </>
            )}

            {user ? (
              <>
                <span className="text-sm text-gray-300">Welcome, {user.email}</span>
                <div className="flex gap-3">
                  {user.role === 'ADMIN' ? (
                    <a href="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm px-3 py-2 rounded-lg bg-accent-gold text-primary-dark font-semibold">Admin Panel</a>
                  ) : null}
                  <button
                    onClick={() => { 
                      try { logout(); } catch {} 
                      setIsMenuOpen(false);
                      try { window.location.assign('/login'); } catch { router.push('/login'); }
                    }}
                    className="text-left text-sm text-white bg-gradient-to-r from-red-400 to-pink-500 px-3 py-2 rounded-full font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-300 hover:text-white"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
