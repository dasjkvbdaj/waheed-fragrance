'use client';

import { useState, useMemo } from 'react';
import { Perfume } from '@/types';
import PerfumeCard from './PerfumeCard';

type ShopCatalogClientProps = {
  perfumes: Perfume[];
  initialCategory: string | null;
};

const ShopCatalogClient: React.FC<ShopCatalogClientProps> = ({ perfumes, initialCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'All');

  const categories = ['All', 'Women', 'Men', 'Unisex'];

  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((perfume) => {
      const matchesSearch = perfume.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' ||
        perfume.category?.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [perfumes, searchTerm, activeCategory]);



  
  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for your favorite scent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary-darker/50 border border-white/10 rounded-2xl py-4 px-6 pl-14 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 transition-all shadow-xl"
          />
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border ${activeCategory === category
                ? "bg-accent-gold text-primary-dark border-accent-gold shadow-lg shadow-accent-gold/20"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center text-gray-500 text-sm">
        Showing {filteredPerfumes.length} {filteredPerfumes.length === 1 ? 'product' : 'products'}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredPerfumes.map((perfume) => (
          <PerfumeCard key={perfume.id} perfume={perfume} />
        ))}
      </div>



      {filteredPerfumes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl font-serif">No products found matching your search.</p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
            className="mt-4 text-accent-gold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopCatalogClient;
