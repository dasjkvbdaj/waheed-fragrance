"use client";

import { useState } from "react";
import { Perfume, PerfumeSize } from "@/types";
import { useStore } from "@/lib/store";
import Image from "next/image";

interface ProductDetailProps {
  perfume: Perfume;
}

export default function ProductDetail({ perfume }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>(perfume.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(perfume, selectedSize, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image Section */}
      <div className="flex items-center justify-center bg-primary-light rounded-lg overflow-hidden">
        <div className="relative w-full aspect-square">
          <Image
            src={perfume.image}
            alt={perfume.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col justify-center">

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{perfume.name}</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="text-3xl font-bold text-accent-gold">${selectedSize.price}</div>
          <div className="bg-accent-gold/20 px-3 py-1 rounded-full">
            <span className="text-accent-gold text-sm uppercase">{perfume.category}</span>
          </div>
        </div>

        {/* Size Selector */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm font-semibold block mb-3">
            Select Size:
          </label>
          <div className="flex flex-wrap gap-3">
            {perfume.sizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${selectedSize.size === size.size
                    ? "bg-accent-gold text-primary-dark"
                    : "bg-primary-light text-gray-300 hover:bg-primary-lighter border border-accent-gold/30"
                  }`}
              >
                <div className="text-sm">{size.size}</div>
                <div className="text-xs mt-1">${size.price}</div>
              </button>
            ))}
          </div>
        </div>

        {perfume.description && (
          <p className="text-gray-400 mb-6 leading-relaxed">{perfume.description}</p>
        )}

        {perfume.notes && (
          <div className="bg-primary-light p-4 rounded-lg mb-6">
            <p className="text-accent-gold text-sm font-semibold mb-2">Fragrance Notes:</p>
            <p className="text-gray-300 text-sm">{perfume.notes}</p>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-400">Quantity:</span>
          <div className="flex items-center border border-accent-gold/30 rounded-lg">
            <button
              onClick={decrementQuantity}
              className="px-4 py-2 hover:bg-primary-light transition"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center bg-primary-dark border-x border-accent-gold/30 py-2"
              min="1"
            />
            <button
              onClick={incrementQuantity}
              className="px-4 py-2 hover:bg-primary-light transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${addedToCart
                ? "bg-green-600 text-white"
                : "bg-accent-gold text-primary-dark hover:bg-yellow-400"
              }`}
          >
            {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
