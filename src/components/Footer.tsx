"use client";

import Link from "next/link";
import { INSTAGRAM_URL } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-darker border-t border-accent-gold/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-bold text-accent-gold">Waheed Fragrance</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the finest fragrances curated for every occasion and personality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 flex-1">
            <h4 className="font-semibold text-accent-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-accent-gold transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent-gold transition">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3 flex-1">
            <h4 className="font-semibold text-accent-gold">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  className="hover:text-accent-gold transition"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="border-t border-accent-gold/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>&copy; {currentYear} Waheed Fragrance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
