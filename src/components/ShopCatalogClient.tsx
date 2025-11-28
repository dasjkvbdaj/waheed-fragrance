"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const categories = ["men", "women", "unisex"];

  useEffect(() => {
    // keep selectedCategory in sync when initialCategory changes (rare — only initial prop)
    setSelectedCategory(initialCategory ?? null);
  }, [initialCategory]);

  // Client-side override: attempt to fetch admin-managed products to reflect live admin changes
  const [clientList, setClientList] = useState<Perfume[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        if (Array.isArray(d.products) && d.products.length > 0) setClientList(d.products);
      })
      .catch(() => {});

    const bc = typeof window !== 'undefined' ? new BroadcastChannel('admin-products') : null;
    bc?.addEventListener('message', () => {
      // simple refresh of admin products when admin updates
      fetch('/api/admin/products')
        .then(r => r.json())
        .then(d => { if (Array.isArray(d.products) && d.products.length > 0) setClientList(d.products); })
        .catch(() => {});
    });

    return () => { mounted = false; bc?.close(); };
  }, []);

  const filteredPerfumes = useMemo(() => {
    const source = clientList ?? perfumes;
    let filtered = source;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === "price-low") sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sortBy === "price-high") sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [selectedCategory, searchTerm, sortBy, perfumes, clientList]);

  // choose the list to display — admin-managed if present, otherwise server-supplied perfumes (used within useMemo)
  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-primary-light border border-accent-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-gold transition"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedCategory(null);
                router.replace(`/shop`);
              }}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === null ? "bg-accent-gold text-primary-dark" : "bg-primary-light text-white hover:bg-primary-light/80"
              }`}
            >
              All Categories
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category as any);
                  router.replace(`/shop?category=${encodeURIComponent(category)}`);
                }}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  selectedCategory === category ? "bg-accent-gold text-primary-dark" : "bg-primary-light text-white hover:bg-primary-light/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-primary-light border border-accent-gold/30 rounded-lg text-white focus:outline-none focus:border-accent-gold transition md:ml-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filteredPerfumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPerfumes.map((perfume) => (
            <div key={perfume.id} className="animate-fade-in">
              <PerfumeCard perfume={perfume} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No perfumes found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory(null);
              router.replace(`/shop`);
            }}
            className="bg-accent-gold text-primary-dark px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
