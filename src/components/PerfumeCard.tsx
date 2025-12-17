"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Perfume, PerfumeSize } from "@/types";
import { useStore } from "@/lib/store";

interface PerfumeCardProps {
  perfume: Perfume;
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  const { addToCart } = useStore();

  // Default to the first size if available
  const [selectedSize, setSelectedSize] = useState<PerfumeSize | null>(
    perfume.sizes.length > 0 ? perfume.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reset selection if perfume changes
  useEffect(() => {
    if (perfume.sizes.length > 0) {
      setSelectedSize(perfume.sizes[0]);
      setQuantity(1);
    }
  }, [perfume]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart(perfume, selectedSize, quantity);

    // Visual feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group h-full bg-primary-darker border border-white/5 rounded-2xl overflow-hidden hover:border-accent-gold/30 transition-all duration-500 flex flex-col shadow-xl">
      {/* Image Section */}
      <div className="relative h-64 md:h-80 w-full bg-black/20">
        <Image
          src={perfume.image}
          alt={perfume.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Category Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full z-10">
          <span className="text-accent-gold text-[10px] font-bold tracking-widest uppercase">{perfume.category}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div>
          <h3 className="text-xl font-bold font-serif text-white mb-1">
            {perfume.name}
          </h3>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sizes</p>
          <div className="flex flex-wrap gap-2">
            {perfume.sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${selectedSize?.size === size.size
                    ? "bg-accent-gold text-primary-dark border-accent-gold"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                  }`}
              >
                {size.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price and Quantity - Side by Side */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold text-accent-gold font-serif">
            ${selectedSize ? selectedSize.price * quantity : 0}
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1 border border-white/10">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="text-white hover:text-accent-gold transition disabled:opacity-30"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="text-white font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="text-white hover:text-accent-gold transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || isAdded}
          className={`w-full py-3.5 font-bold text-sm rounded-xl transition-all duration-300 items-center justify-center gap-2 flex ${isAdded
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-accent-gold to-yellow-600 text-primary-dark hover:scale-[1.02] active:scale-[0.98]"
            }`}
        >
          {isAdded ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
