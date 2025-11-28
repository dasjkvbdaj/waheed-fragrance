import ShopCatalogClient from "@/components/ShopCatalogClient";
import prisma from "@/lib/prisma";

interface Props {
  searchParams?: { category?: string };
}

export default async function CatalogPage({ searchParams }: Props) {
  // Read initial category from the URL query param (server-side)
  const initialCategory = searchParams?.category ?? null;

  // Prefer admin-managed list (json) if it exists so admin changes show immediately
  let perfumes: any[] = [];
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const DB_FILE = path.join(process.cwd(), 'src', 'data', 'adminProducts.json');
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const data = JSON.parse(raw || '[]');
    if (Array.isArray(data) && data.length > 0) {
      perfumes = data as any[];
      // remove any deleted product ids
      try {
        const deletedRaw = await fs.readFile(path.join(process.cwd(), 'src', 'data', 'deletedProducts.json'), 'utf8');
        const deletedIds = JSON.parse(deletedRaw || '[]');
        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          perfumes = perfumes.filter((p: any) => !deletedIds.includes(String(p.id)));
        }
      } catch {}
      // remove demo 'Amber Noir' if present
      perfumes = perfumes.filter((p: any) => String(p.name).toLowerCase() !== 'amber noir');
    }
  } catch (e) {
    // no local admin products
  }

  if (perfumes.length === 0) {
    // Fetch perfumes from DB
    perfumes = await prisma.perfume.findMany({
      include: { sizes: true },
    }) as any[];
    // Remove any deleted ids from DB results
    try {
      const fsp = await import('fs/promises');
      const pth = await import('path');
      const deletedRaw = await fsp.readFile(pth.join(process.cwd(), 'src', 'data', 'deletedProducts.json'), 'utf8');
      const deletedIds = JSON.parse(deletedRaw || '[]');
      if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        perfumes = perfumes.filter((p: any) => !deletedIds.includes(String(p.id)));
      }
    } catch {}
    // remove demo 'Amber Noir' if present in DB
    perfumes = perfumes.filter((p: any) => String(p.name).toLowerCase() !== 'amber noir');
  }

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
