export interface PerfumeSize {
  size: string; // e.g., "50ml", "100ml"
  price: number;
}

export interface Perfume {
  id: string;
  name: string;
  //brand: string;
  sizes: PerfumeSize[]; // Array of sizes with different prices
  // category comes from external sources and can be a free string
  category: string;
  image: string;
  description?: string | null;
  notes?: string | null;
  // some data sources include a top-level price (optional)
  price?: number | null;
}

export interface CartItem {
  perfume: Perfume;
  selectedSize: PerfumeSize; // Track which size was selected
  quantity: number;
}
