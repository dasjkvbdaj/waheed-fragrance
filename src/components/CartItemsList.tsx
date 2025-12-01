"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartItem } from "@/types";
import { useStore } from "@/lib/store";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface CartItemsListProps {
  items: CartItem[];
}

export default function CartItemsList({ items }: CartItemsListProps) {
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const clearCart = useStore((state) => state.clearCart);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    building: "",
    floor: "",
    details: "",
    phone: "",
  });

  const validItems = items.filter((it) => it && it.perfume && it.selectedSize && typeof it.quantity === "number");

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.street || !formData.building || !formData.floor || !formData.phone) {
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
        customerPhone: formData.phone,
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
        createdAt: new Date().toISOString(),
      };

      // 1. Save to Firestore
      await addDoc(collection(db, "orders"), orderData);

      // 2. Trigger Automated WhatsApp (Background)
      // We don't await this to fail the order if the message fails, but it's good to try.
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customerPhone: formData.phone,
            address: fullAddress,
            items: validItems.map(item => ({
              name: item.perfume.name,
              size: item.selectedSize.size,
              quantity: item.quantity
            })),
            totalPrice
          })
        });
      } catch (err) {
        console.error("Failed to send automated WhatsApp:", err);
        // Fallback: Open WhatsApp manually if automation fails? 
        // For now, we just log it as the user requested "automatically".
      }

      // 3. Clear Cart and Show Success
      clearCart();
      setIsCheckoutOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validItems.length === 0 && !isSuccessOpen) {
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
      {!isSuccessOpen && (
        <>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Additional Details (Optional)</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none resize-none h-20"
                  placeholder="Near the supermarket..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none"
                  placeholder="+961 70 123456"
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

      {/* Success Popup */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-primary-darker border border-accent-gold/20 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
            <p className="text-gray-400 mb-6">
              Your order has been placed. We will contact you soon for delivery.
            </p>
            <Link
              href="/shop"
              className="inline-block w-full py-3 rounded-xl bg-accent-gold text-primary-dark font-bold hover:bg-yellow-400 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
