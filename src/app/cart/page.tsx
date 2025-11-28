"use client";

import { useStore } from "@/lib/store";
import CartItemsList from "@/components/CartItemsList";

export default function CartPage() {
  const items = useStore((state) => state.items);

  return (
    <div className="min-h-screen bg-primary-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12">Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="lg:col-span-1">
              <CartItemsList items={items} />
            </div>
          </div>
        ) : (
          <CartItemsList items={items} />
        )}
      </div>
    </div>
  );
}
