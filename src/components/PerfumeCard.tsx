"use client";

import Link from "next/link";
import Image from "next/image";
import { Perfume } from "@/types";

interface PerfumeCardProps {
  perfume: Perfume;
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  // router unused — the card uses Link to navigate
  return (
    <Link href={`/product/${perfume.id}`}>
      <div className="group bg-primary-light rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-accent-gold/20 transition-all duration-300 cursor-pointer transform hover:scale-105">
        <div className="relative h-64 md:h-80 bg-primary-darker overflow-hidden">
          <Image
            src={perfume.image}
            alt={perfume.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-accent-gold/20 backdrop-blur px-3 py-1 rounded-full">
            <span className="text-accent-gold text-xs font-semibold uppercase">{perfume.category}</span>
          </div>
        </div>

          <div className="p-4 relative">
          {/* <p className="text-accent-gold text-xs uppercase tracking-widest mb-1">
            {perfume.brand}
          </p> */}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-accent-gold transition">
            {perfume.name}
          </h3>
          <div className="flex flex-wrap gap-1 mb-3">
            {perfume.sizes.map((size) => (
              <span key={size.size} className="text-gray-400 text-xs bg-primary-darker px-2 py-1 rounded">
                {size.size}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-accent-gold">
                ${Math.min(...perfume.sizes.map((s) => s.price))}
              </span>
            </div>
            <div className="bg-accent-gold/10 p-2 rounded-lg group-hover:bg-accent-gold/20 transition">
              <svg
                className="w-5 h-5 text-accent-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            {/* View button removed — the entire card links to product details already */}
          </div>
        </div>
      </div>
    </Link>
  );
}
