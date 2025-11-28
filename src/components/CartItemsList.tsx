"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types";
import { useStore } from "@/lib/store";
import { getWhatsAppOrderLink } from "@/lib/constants";

interface CartItemsListProps {
  items: CartItem[];
}

export default function CartItemsList({ items }: CartItemsListProps) {
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const getTotalPrice = useStore((state) => state.getTotalPrice);

  const validItems = items.filter((it) => it && it.perfume && it.selectedSize && typeof it.quantity === "number");

  if (validItems.length === 0) {
    return (
      <div className="text-center py-20">
        <svg
          className="w-16 h-16 mx-auto text-gray-600 mb-4"
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
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Start shopping to add items to your cart</p>
        <Link
          href="/shop"
          className="inline-block bg-accent-gold text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {validItems.map((item) => (
          <div
            key={`${item.perfume?.id ?? Math.random().toString(36).slice(2)}-${item.selectedSize.size}`}
            className="bg-primary-light rounded-lg p-4 flex gap-4 items-start hover:bg-primary-light/80 transition"
          >
            {/* Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.perfume?.image ?? "/Amber_Noir.jpg"}
                alt={item.perfume?.name ?? "Unknown product"}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{item.perfume?.name ?? "Unknown product"}</h3>
                </div>
                <button
                  onClick={() => removeFromCart(item.perfume?.id ?? "", item.selectedSize.size)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-3 font-semibold text-accent-gold">
                Size: {item.selectedSize.size}
              </p>

              {/* Quantity and Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-accent-gold/30 rounded-lg bg-primary-dark">
                  <button
                    onClick={() =>
                      updateQuantity(item.perfume?.id ?? "", item.selectedSize.size, Math.max(1, item.quantity - 1))
                    }
                    className="px-3 py-1 hover:bg-primary-light transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.perfume?.id ?? "", item.selectedSize.size, Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-12 text-center bg-primary-dark border-x border-accent-gold/30 py-1"
                    min="1"
                  />
                  <button
                    onClick={() =>
                      updateQuantity(item.perfume?.id ?? "", item.selectedSize.size, item.quantity + 1)
                    }
                    className="px-3 py-1 hover:bg-primary-light transition"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    ${item.selectedSize.price.toFixed(2)} each
                  </p>
                  <p className="text-lg font-bold text-accent-gold">
                    ${(item.selectedSize.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-primary-light rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg">Subtotal:</span>
          <span className="text-2xl font-bold text-accent-gold">
            ${getTotalPrice().toFixed(2)}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-6">Shipping and taxes calculated at checkout</p>
        <a
          href={getWhatsAppOrderLink(validItems)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-accent-gold text-primary-dark py-3 rounded-lg font-semibold hover:bg-yellow-400 transition mb-3 block text-center"
        >
          Order via WhatsApp
        </a>
        <Link
          href="/shop"
          className="block w-full text-center bg-primary-dark border border-accent-gold/30 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
