"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const items = useStore((state) => state.items);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    try { logout(); } catch { /* ignore */ }
    // force a full reload to land on a clean /login and ensure CSS/global styles are applied
    try { window.location.assign('/login'); } catch { router.push('/login'); }
  };

  return (
    <header className="fixed top-0 w-full bg-primary-dark/80 backdrop-blur-md border-b border-white/10 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-serif font-bold text-accent-gold hover:text-white transition-colors duration-300">
              Waheed Fragrance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {user?.role !== 'ADMIN' && (
              <>
                <Link href="/" className="text-sm font-medium text-gray-300 hover:text-accent-gold transition-colors duration-300 uppercase tracking-wider">
                  Home
                </Link>
                <Link href="/shop" className="text-sm font-medium text-gray-300 hover:text-accent-gold transition-colors duration-300 uppercase tracking-wider">
                  Shop
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Welcome</span>
                  <span className="text-sm font-medium text-white">{user.email}</span>
                </div>

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-accent-gold/10 border border-accent-gold/50 text-accent-gold rounded-full text-sm font-medium hover:bg-accent-gold hover:text-primary-dark transition-all duration-300"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-accent-gold transition-colors duration-300 uppercase tracking-wider">
                Login
              </Link>
            )}

            {/* Cart Icon (Non-Admin) */}
            {user?.role !== 'ADMIN' && (
              <Link
                href="/cart"
                className="relative p-2 text-gray-300 hover:text-accent-gold transition-colors duration-300"
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
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-gold text-primary-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            {user?.role !== 'ADMIN' && (
              <Link
                href="/cart"
                className="relative p-2 text-gray-300 hover:text-accent-gold transition-colors duration-300"
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
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-gold text-primary-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-darker border-t border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-6 space-y-4">
              {user?.role !== 'ADMIN' && (
                <>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-gray-300 hover:text-accent-gold transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-gray-300 hover:text-accent-gold transition-colors"
                  >
                    Shop
                  </Link>
                </>
              )}

              {user ? (
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Signed in as</span>
                    <span className="text-sm font-medium text-white">{user.email}</span>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 bg-accent-gold/10 border border-accent-gold/50 text-accent-gold rounded-lg font-medium hover:bg-accent-gold hover:text-primary-dark transition-all"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-center px-4 py-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
                >
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
