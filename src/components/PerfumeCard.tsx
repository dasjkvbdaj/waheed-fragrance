"use client";

import Link from "next/link";
import Image from "next/image";
import { Perfume } from "@/types";

interface PerfumeCardProps {
  perfume: Perfume;
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  const lowestPrice = perfume.sizes.length > 0 ? Math.min(...perfume.sizes.map((s) => s.price)) : 0;

  return (
    <Link href={`/product/${perfume.id}`}>
      <div className="group h-full bg-primary-light/30 border border-white/5 rounded-2xl overflow-hidden hover:border-accent-gold/30 hover:shadow-2xl hover:shadow-accent-gold/10 transition-all duration-500 cursor-pointer flex flex-col">
        <div className="relative h-64 md:h-80 bg-primary-darker overflow-hidden">
          <Image
            src={perfume.image}
            alt={perfume.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">{perfume.category}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-serif font-bold mb-2 text-white group-hover:text-accent-gold transition-colors duration-300 line-clamp-1">
            {perfume.name}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {perfume.sizes.slice(0, 3).map((size) => (
              <span key={size.size} className="text-gray-400 text-[10px] uppercase tracking-wider border border-white/10 px-2 py-1 rounded-md">
                {size.size}
              </span>
            ))}
            {perfume.sizes.length > 3 && (
              <span className="text-gray-400 text-[10px] px-1 py-1">+</span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">

              <span className="text-2xl font-bold text-accent-gold font-serif">
                ${lowestPrice}
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold text-accent-gold group-hover:text-primary-dark transition-all duration-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
