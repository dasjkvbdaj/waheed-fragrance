import Link from "next/link";
import Image from "next/image";
import PerfumeCard from "@/components/PerfumeCard";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  // First try to load any admin-managed products (JSON file) so changes made in admin are visible on home
  const fs = await import('fs/promises');
  const path = await import('path');
  const DB_FILE = path.join(process.cwd(), 'src', 'data', 'adminProducts.json');
  let featuredPerfumes: any[] = [];
  try {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const data = JSON.parse(raw || '[]');
    if (Array.isArray(data) && data.length > 0) {
      featuredPerfumes = data.slice(0, 4);
    }
  } catch (e) {
    // no admin data - fallback to DB
  }

  if (featuredPerfumes.length === 0) {
    featuredPerfumes = await prisma.perfume.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' }, // Or any other logic
      include: { sizes: true },
    });
  }

  return (
    <div className="bg-primary-dark">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <p className="text-accent-gold text-sm uppercase tracking-widest mb-2">
                Welcome to our store
              </p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Discover Your
                <span className="text-accent-gold"> Signature</span>
                <br />
                Scent
              </h1>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Experience the finest collection of curated fragrances. From fresh citrus to warm musks,
              find the perfume that tells your story.
            </p>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Link
                href="/shop"
                className="bg-accent-gold text-primary-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition transform hover:scale-105"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right - Featured Image */}
          <div className="relative h-96 md:h-full min-h-[500px]">
            <div className="absolute inset-0 bg-primary-light rounded-3xl overflow-hidden">
              <Image
                src="/heroImage.jpg"
                alt="Featured Perfume"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <p className="text-accent-gold text-sm uppercase tracking-widest mb-2">Featured</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Bestsellers</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Explore our most loved fragrances, carefully selected by our customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredPerfumes.map((perfume, index) => (
            <div key={perfume.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <PerfumeCard perfume={perfume} />
            </div>
          ))}
          {featuredPerfumes.length === 0 && (
            <div className="col-span-4 text-center text-gray-500">
              No products found. Check back soon!
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block border-2 border-accent-gold text-accent-gold px-8 py-3 rounded-lg font-semibold hover:bg-accent-gold hover:text-primary-dark transition"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-primary-lighter py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-400">
                100% authentic fragrances sourced from authorized distributors worldwide
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-400">
                Quick and reliable worldwide delivery with tracking included
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-gray-400">
                Get personalized fragrance recommendations from our team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Men */}
          <Link href="/shop?category=men">
            <div className="group relative h-64 bg-primary-light rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-accent-gold/20 transition cursor-pointer">
              <Image
                src="/mencollection.jpg"
                alt="Men's Fragrances"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-end p-6">
                <h3 className="text-2xl font-bold">Men's Collection</h3>
              </div>
            </div>
          </Link>

          {/* Women */}
          <Link href="/shop?category=women">
            <div className="group relative h-64 bg-primary-light rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-accent-gold/20 transition cursor-pointer">
              <Image
                src="/womencollection.jpg"
                alt="Women's Fragrances"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-end p-6">
                <h3 className="text-2xl font-bold">Women's Collection</h3>
              </div>
            </div>
          </Link>

          {/* Unisex */}
          <Link href="/shop?category=unisex">
            <div className="group relative h-64 bg-primary-light rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-accent-gold/20 transition cursor-pointer">
              <Image
                src="/unisexcollection.jpg"
                alt="Unisex Fragrances"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-end p-6">
                <h3 className="text-2xl font-bold">Unisex Collection</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
