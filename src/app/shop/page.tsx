import ShopCatalogClient from "@/components/ShopCatalogClient";
import dbConnect from "@/lib/db";
import Perfume from "@/models/Perfume";

interface Props {
  searchParams?: { category?: string };
}

export default async function CatalogPage({ searchParams }: Props) {
  // Read initial category from the URL query param (server-side)
  const initialCategory = searchParams?.category ?? null;

  await dbConnect();

  // Fetch perfumes from MongoDB
  let perfumes = await Perfume.find({
    name: { $ne: 'Amber Noir' } // Filter out demo product
  }).sort({ createdAt: -1 }).lean();

  // Map _id to id for frontend compatibility
  perfumes = perfumes.map((p: any) => ({
    ...p,
    id: p._id.toString(),
    _id: undefined
  }));

  // If MongoDB is empty, we might want to seed or show nothing.
  // The original code had complex fallback logic.
  // For now, we trust MongoDB has data (or user will add it).


  return (
    <div className="min-h-screen bg-primary-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Collection</h1>
          <p className="text-gray-400 text-lg">
            Discover our curated selection of premium fragrances
          </p>
        </div>

        {/* Client-rendered filters and product grid */}
        <ShopCatalogClient perfumes={perfumes as any} initialCategory={initialCategory} />
      </div>
    </div>
  );
}
