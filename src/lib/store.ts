import { create } from "zustand";
import { CartItem, Perfume, PerfumeSize } from "@/types";

interface CartStore {
  items: CartItem[];
  hydrated: boolean;
  initializeStore: () => void;
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
  items: [],
  user: null,
  hydrated: false,

  initializeStore: () => {
    if (typeof window === "undefined" || get().hydrated) return;

    // Load Cart
    try {
      const rawCart = localStorage.getItem("cart");
      if (rawCart) {
        const parsed = JSON.parse(rawCart);
        if (Array.isArray(parsed)) {
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
          set({ items: validated });
        }
      }
    } catch (e) {
      console.warn("Failed to load cart", e);
    }

    // Load User
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed && typeof parsed === "object" && parsed.email && parsed.role && parsed.id) {
          set({ user: parsed });
        }
      }
    } catch (e) {
      console.warn("Failed to load user", e);
    }

    set({ hydrated: true });
  },

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

  login: (user) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch { }
    }
    set({ user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("user");
      } catch { }
    }
    set({ user: null });
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
    try { if (typeof window !== 'undefined') window.location.assign('/login'); } catch (e) { }
  },
}));
