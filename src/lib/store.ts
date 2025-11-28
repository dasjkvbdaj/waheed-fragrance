import { create } from "zustand";
import { CartItem, Perfume, PerfumeSize } from "@/types";

interface CartStore {
  items: CartItem[];
  addToCart: (perfume: Perfume, selectedSize: PerfumeSize, quantity: number) => void;
  removeFromCart: (perfumeId: string, size: string) => void;
  updateQuantity: (perfumeId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

interface AuthStore {
  user: { id: string; email: string; role: string } | null;
  login: (user: { id: string; email: string; role: string }) => void;
  logout: () => void;
}

type Store = CartStore & AuthStore;

export const useStore = create<Store>((set, get) => ({
  // Load and validate persisted cart from localStorage (defensive parsing)
  items: (() => {
    if (typeof window === "undefined") return [] as CartItem[];

    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return [] as CartItem[];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [] as CartItem[];

      const isValidItem = (item: any) => {
        return (
          item &&
          typeof item.quantity === "number" &&
          item.selectedSize &&
          typeof item.selectedSize.size === "string" &&
          typeof item.selectedSize.price === "number" &&
          item.perfume &&
          typeof item.perfume.id === "string" &&
          typeof item.perfume.image === "string"
        );
      };

      const validated = parsed.filter(isValidItem);

      // If anything got filtered out, update storage so we don't re-load invalid entries later
      if (validated.length !== parsed.length) {
        localStorage.setItem("cart", JSON.stringify(validated));
      }

      return validated as CartItem[];
    } catch (e) {
      console.warn("Failed to parse persisted cart; clearing invalid data.", e);
      localStorage.removeItem("cart");
      return [] as CartItem[];
    }
  })(),

  addToCart: (perfume: Perfume, selectedSize: PerfumeSize, quantity: number) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.perfume.id === perfume.id && item.selectedSize.size === selectedSize.size
      );

      let newItems;
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.perfume.id === perfume.id && item.selectedSize.size === selectedSize.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { perfume, selectedSize, quantity }];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newItems));
      }

      return { items: newItems };
    });
  },

  removeFromCart: (perfumeId: string, size: string) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => !(item.perfume.id === perfumeId && item.selectedSize.size === size)
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newItems));
      }
      return { items: newItems };
    });
  },

  updateQuantity: (perfumeId: string, size: string, quantity: number) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.perfume.id === perfumeId && item.selectedSize.size === size
          ? { ...item, quantity }
          : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newItems));
      }
      return { items: newItems };
    });
  },

  clearCart: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    set({ items: [] });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.selectedSize.price * item.quantity, 0);
  },

  // Auth Slice
  user: (() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      if (typeof parsed.email !== "string" || typeof parsed.role !== "string" || typeof parsed.id !== "string") return null;
      return parsed as { id: string; email: string; role: string };
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  })(),
  login: (user) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {}
    }
    set({ user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("user");
      } catch {}
    }
    // Clear client-side stored user state
    set({ user: null });
    // Optional: Call API to logout to clear cookie/session server side
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
    // ensure we end up at the login page and reload a clean state
    try { if (typeof window !== 'undefined') window.location.assign('/login'); } catch (e) {}
  },
}));
