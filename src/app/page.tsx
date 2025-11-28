import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  // This page only displays static content (hero, about us, categories)
  // No database queries needed here


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

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Us</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Discover the passion and philosophy behind our exquisite fragrances.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
          <div className="md:w-1/2">
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              At Waheed Fragrance, we believe that fragrance is an art form, a personal statement, and a cherished memory waiting to be made.
              Our journey began with a simple vision: to craft unique and captivating scents that resonate with the individual spirit.
              Every bottle tells a story of dedication, quality, and a profound love for the world of perfumery.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We meticulously source the finest ingredients from around the globe, collaborating with master perfumers to create
              olfactory masterpieces. From the initial spark of inspiration to the final delicate blend,
              each fragrance is a testament to our commitment to excellence and our desire to bring you an unparalleled sensory experience.
              Join us in exploring a world where scent transcends the ordinary and becomes an extraordinary part of your life.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            {/* Placeholder for the About Us image */}
            <img
              src="/about-us-hero.jpg"
              alt="About Us - Perfume bottles and ingredients"
              className="rounded-lg shadow-xl max-w-sm w-full h-auto"
            />

          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-primary-lighter py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Key Benefits</h2>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-400">
                100% authentic fragrances
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-400">
                Quick and reliable delivery all over Lebanon
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
                className="object-cover group-hover:scale-110 transition-transform duration-500"
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
