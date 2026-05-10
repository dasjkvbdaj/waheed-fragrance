import { create } from "zustand";
import { CartItem, Perfume, PerfumeSize } from "@/types";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  logout: () => Promise<void>;
}

interface ProductStore {
  products: Perfume[];
  productsLoaded: boolean;
  productsLastFetched: number | null;
  fetchProducts: () => Promise<void>;
  setProducts: (products: Perfume[]) => void;
  addProduct: (product: Perfume) => void;
  updateProduct: (product: Perfume) => void;
  deleteProduct: (productId: string) => void;
}

type Store = CartStore & AuthStore & ProductStore;

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
  logout: async () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("user");
      } catch { }
    }
    set({ user: null });
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { }
  },

  // Product Store
  products: [],
  productsLoaded: false,
  productsLastFetched: null,

  fetchProducts: async () => {
    const { productsLoaded, productsLastFetched } = get();

    // Cache check for initial load
    const now = Date.now();
    if (productsLoaded && productsLastFetched && (now - productsLastFetched < 300000)) {
      return;
    }

    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const newProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Perfume[];

      set({
        products: newProducts,
        productsLoaded: true,
        productsLastFetched: Date.now(),
      });
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  },
  setProducts: (products: Perfume[]) => set({ products, productsLoaded: true, productsLastFetched: Date.now() }),
  addProduct: (product: Perfume) => set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (updatedProduct: Perfume) => set((state) => ({
    products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
  })),
  deleteProduct: (productId: string) => set((state) => ({
    products: state.products.filter((p) => p.id !== productId),
  })),
}));
