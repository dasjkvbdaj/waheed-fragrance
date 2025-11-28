'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from "@/components/ProductDetail";
import Link from "next/link";
import Image from "next/image";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [perfume, setPerfume] = useState<any>(null);
  const [relatedPerfumes, setRelatedPerfumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            throw new Error('Failed to fetch product');
          }
          return;
        }

        const data = await response.json();
        setPerfume(data.perfume);
        setRelatedPerfumes(data.relatedPerfumes || []);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !perfume) {
    return (
      <div className="min-h-screen bg-primary-dark pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
            {error || 'Product not found'}
          </div>
          <Link
            href="/shop"
            className="inline-block mt-6 text-accent-gold hover:underline"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-gray-400 text-sm flex items-center">
          <Link href="/" className="hover:text-accent-gold transition">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-accent-gold transition">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-accent-gold">{perfume.name}</span>
        </div>

        {/* Product Detail */}
        <ProductDetail perfume={perfume} />

        {/* Related Products */}
        <div className="mt-20 pt-20 border-t border-accent-gold/20">
          <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedPerfumes.map((p: any) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="group bg-primary-light rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-accent-gold/20 transition-all duration-300 hover:scale-105 block"
              >
                <div className="aspect-square bg-primary-darker overflow-hidden relative">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{p.name}</h3>
                  <p className="text-accent-gold font-bold">
                    ${Math.min(...p.sizes.map((s: any) => s.price))}
                  </p>
                </div>
              </Link>
            ))}
            {relatedPerfumes.length === 0 && (
              <p className="text-gray-500 col-span-4 text-center">No related products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
