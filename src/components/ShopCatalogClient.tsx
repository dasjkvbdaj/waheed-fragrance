"use client";

import { useState, useMemo, useEffect } from "react";
import PerfumeCard from "@/components/PerfumeCard";
import type { Perfume } from "@/types";

interface Props {
  perfumes: Perfume[];
  initialCategory?: string | null;
}

export default function ShopCatalogClient({ perfumes, initialCategory = null }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory ?? null);
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "name">("name");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["men", "women", "unisex"];

  useEffect(() => {
    setSelectedCategory(initialCategory ?? null);
  }, [initialCategory]);

  const getPrice = (p: Perfume) => {
    if (typeof p.price === 'number') return p.price;
    if (p.sizes && p.sizes.length > 0) {
      return Math.min(...p.sizes.map(s => s.price));
    }
    return 0;
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // Update URL without navigation for instant response
    const url = category ? `/shop?category=${encodeURIComponent(category)}` : '/shop';
    window.history.pushState({}, '', url);
  };

  const filteredPerfumes = useMemo(() => {
    let filtered = perfumes;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    const sorted = [...filtered];
    if (sortBy === "price-low") sorted.sort((a, b) => getPrice(a) - getPrice(b));
    else if (sortBy === "price-high") sorted.sort((a, b) => getPrice(b) - getPrice(a));
    else sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [selectedCategory, searchTerm, sortBy, perfumes]);

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-12 space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-primary-light/50 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/50 transition-all duration-300 backdrop-blur-sm"
          />
          <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap justify-center md:justify-start">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === null
                ? "bg-accent-gold text-primary-dark shadow-lg shadow-accent-gold/20"
                : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full capitalize text-sm font-medium transition-all duration-200 ${selectedCategory === category
                  ? "bg-accent-gold text-primary-dark shadow-lg shadow-accent-gold/20"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-6 pr-12 py-2 bg-primary-light/50 border border-white/10 rounded-full text-white text-sm focus:outline-none focus:border-accent-gold/50 cursor-pointer hover:bg-primary-light transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredPerfumes.length > 0 ? (
          filteredPerfumes.map((perfume) => (
            <div key={perfume.id}>
              <PerfumeCard perfume={perfume} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-lg mb-6 font-light">No perfumes found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                handleCategoryChange(null);
              }}
              className="px-8 py-3 bg-accent-gold text-primary-dark rounded-full font-semibold hover:bg-white transition-colors duration-300 shadow-lg shadow-accent-gold/20"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
