"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartItem } from "@/types";
import { useStore } from "@/lib/store";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useEffect } from "react";

interface CartItemsListProps {
  items: CartItem[];
}

export default function CartItemsList({ items }: CartItemsListProps) {
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const clearCart = useStore((state) => state.clearCart);
  const initializeStore = useStore((state) => state.initializeStore);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    building: "",
    floor: "",
    details: "",
    phoneNumber: "",
  });

  useEffect(() => {
    setMounted(true);
    initializeStore();
  }, [initializeStore]);

  const validItems = items.filter((it) => it && it.perfume && it.selectedSize && typeof it.quantity === "number");

  if (!mounted) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.street || !formData.building || !formData.floor) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const totalPrice = getTotalPrice();

      const fullAddress = `${formData.city}, ${formData.street}, ${formData.building}, ${formData.floor}${formData.details ? `, ${formData.details}` : ''}`;

      const orderData = {
        orderId,
        fullDeliveryAddress: fullAddress,
        cartItems: validItems.map(item => ({
          name: item.perfume.name,
          size: item.selectedSize.size,
          price: item.selectedSize.price,
          quantity: item.quantity,
          image: item.perfume.image
        })),
        totalPrice,
        status: "new",
        phoneNumber: formData.phoneNumber,
        createdAt: new Date().toISOString(),
      };

      // 1. Save to Firestore
      await addDoc(collection(db, "orders"), orderData);

      // 2. Redirect to WhatsApp
      const addressDetails = `City: ${formData.city}, Street: ${formData.street}, Building: ${formData.building}, Floor: ${formData.floor}${formData.details ? `, Additional Details: ${formData.details}` : ''}`;

      const message = `Hello, I would like to order the following items:

${validItems
          .map(
            (item) =>
              `-  ${item.perfume.name} (${item.selectedSize.size}) x${item.quantity}`
          )
          .join("\n")}

Address: ${addressDetails}
`;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const baseUrl = isMobile
        ? "https://api.whatsapp.com/send"
        : "https://web.whatsapp.com/send";

      const whatsappUrl = `${baseUrl}?phone=${96176919542}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // 3. Clear Cart
      clearCart();
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      {/* Cart Items */}
      {validItems.length > 0 && (
        <>
          <div className="space-y-4">
            {validItems.map((item) => (
              <div
                key={`${item.perfume?.id ?? Math.random().toString(36).slice(2)}-${item.selectedSize.size}`}
                className="bg-primary-light rounded-xl p-4 flex gap-4 items-start relative hover:bg-primary-light/80 transition group"
              >
                {/* Delete Button - Absolute Top Right */}
                <button
                  onClick={() => removeFromCart(item.perfume?.id ?? "", item.selectedSize.size)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition p-1 hover:bg-primary-dark/50 rounded-full z-10"
                  aria-label="Remove item"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>

                {/* Left Side: Image + Mobile Quantity */}
                <div className="flex flex-col items-center gap-3">
                  {/* Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-primary-dark">
                    <Image
                      src={item.perfume?.image ?? "/Amber_Noir.jpg"}
                      alt={item.perfume?.name ?? "Unknown product"}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Mobile Quantity Selector (Hidden on Desktop) */}
                  <div className="flex md:hidden items-center border border-accent-gold/30 rounded-md bg-primary-dark overflow-hidden h-7 w-20 shadow-sm">
                    <button
                      onClick={() =>
                        updateQuantity(item.perfume?.id ?? "", item.selectedSize.size, Math.max(1, item.quantity - 1))
                      }
                      className="w-6 h-full text-white hover:bg-white/10 transition active:bg-white/20 text-[10px] flex items-center justify-center font-bold"
                    >
                      −
                    </button>
                    <div className="flex-1 h-full flex items-center justify-center text-white text-xs font-bold border-x border-accent-gold/30 bg-primary-dark/50">
                      {item.quantity}
                    </div>
                    <button
                      onClick={() =>
                        updateQuantity(item.perfume?.id ?? "", item.selectedSize.size, item.quantity + 1)
                      }
                      className="w-6 h-full text-white hover:bg-white/10 transition active:bg-white/20 text-[10px] flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right Side: Details + Desktop Quantity + Price */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch pr-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white leading-tight mb-1">
                      {item.perfume?.name ?? "Unknown product"}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">
                      Size: {item.selectedSize.size}
                    </p>
                  </div>

                  {/* Bottom Row: Desktop Quantity + Price */}
                  <div className="flex items-end justify-end md:justify-between w-full mt-2">
                    {/* Desktop Quantity Selector (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center border border-accent-gold/30 rounded-lg bg-primary-dark overflow-hidden h-9">
                      <button
                        onClick={() =>
                          updateQuantity(item.perfume?.id ?? "", item.selectedSize.size, Math.max(1, item.quantity - 1))
                        }
                        className="px-3 h-full text-white hover:bg-white/10 transition active:bg-white/20"
                      >
                        −
                      </button>
                      <div className="w-10 h-full flex items-center justify-center text-white font-medium border-x border-accent-gold/30 py-1">
                        {item.quantity}
                      </div>
                      <button
                        onClick={() =>
                          updateQuantity(item.perfume?.id ?? "", item.selectedSize.size, item.quantity + 1)
                        }
                        className="px-3 h-full text-white hover:bg-white/10 transition active:bg-white/20"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">
                        ${item.selectedSize.price.toFixed(2)} each
                      </p>
                      <p className="text-xl font-bold text-accent-gold">
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
              <span className="text-lg">Total:</span>
              <span className="text-2xl font-bold text-accent-gold">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-accent-gold text-primary-dark py-3 rounded-lg font-semibold hover:bg-yellow-400 transition mb-3 block text-center"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/shop"
              className="block w-full text-center bg-primary-dark border border-accent-gold/30 py-3 rounded-lg font-semibold hover:bg-primary-light transition"
            >
              Continue Shopping
            </Link>
          </div>
        </>
      )}

      {/* Checkout Popup */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-primary-darker border border-accent-gold/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-accent-gold mb-6 text-center">Checkout</h3>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none"
                    placeholder="Beirut"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Street</label>
                  <input
                    required
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none"
                    placeholder="Hamra St"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Building</label>
                  <input
                    required
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none"
                    placeholder="Plaza Bldg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Floor</label>
                  <input
                    required
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none"
                    placeholder="3rd Floor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none"
                  placeholder="+961 00 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Additional Details (Optional)</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none resize-none h-20"
                  placeholder="Near the supermarket..."
                />
              </div>


              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-accent-gold text-primary-dark font-bold hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
