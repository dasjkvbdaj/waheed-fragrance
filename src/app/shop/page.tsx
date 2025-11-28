'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ShopCatalogClient from "@/components/ShopCatalogClient";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') ?? null;

  const [perfumes, setPerfumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPerfumes() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setPerfumes(data.perfumes || []);
      } catch (err) {
        console.error('Error fetching perfumes:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPerfumes();
  }, []);

  return (
    <div className="min-h-screen bg-primary-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Collection</h1>
          <p className="text-gray-400 text-lg">
            Discover our curated selection of premium fragrances
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Client-rendered filters and product grid */}
        {!loading && !error && (
          <ShopCatalogClient perfumes={perfumes} initialCategory={initialCategory} />
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-dark pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
