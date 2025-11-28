import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Try database first
  let perfume: any = await prisma.perfume.findUnique({
    where: { id: params.id },
    include: { sizes: true },
  });

  // If product not in DB (e.g. admin-managed JSON list), attempt to load from adminProducts.json
  if (!perfume) {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const DB_FILE = path.join(process.cwd(), 'src', 'data', 'adminProducts.json');
      const raw = await fs.readFile(DB_FILE, 'utf8');
      const data = JSON.parse(raw || '[]');
      if (Array.isArray(data)) {
        const found = data.find((p: any) => String(p.id) === String(params.id));
        if (found) {
          // Ensure sizes array exists and shape matches expected
          perfume = {
            ...found,
            sizes: (found.sizes || []).map((s: any) => ({ size: s.size, price: Number(s.price || 0) })),
          };
        }
      }
    } catch (e) {
      // ignore — will handle notFound below
    }
  }

  if (!perfume) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const relatedPerfumes = await prisma.perfume.findMany({
    where: {
      category: perfume.category,
      id: { not: perfume.id },
    },
    take: 4,
    include: { sizes: true },
  });

  return (
    <div className="min-h-screen bg-primary-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 text-gray-400 text-sm flex items-center">
          <Link href="/" className="hover:text-accent-gold transition">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-accent-gold transition">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-accent-gold">{perfume.name}</span>
        </div>

        {/* Product Detail */}
        <ProductDetail perfume={perfume} />

        {/* Related Products */}
        <div className="mt-20 pt-20 border-t border-accent-gold/20">
          <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedPerfumes.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="group bg-primary-light rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-accent-gold/20 transition-all duration-300 hover:scale-105 block"
              >
                <div className="aspect-square bg-primary-darker overflow-hidden relative">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{p.name}</h3>
                  <p className="text-accent-gold font-bold">
                    ${Math.min(...p.sizes.map((s) => s.price))}
                  </p>
                </div>
              </Link>
            ))}
            {relatedPerfumes.length === 0 && (
              <p className="text-gray-500 col-span-4 text-center">No related products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
