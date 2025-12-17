'use client';

type Perfume = {
  id: string;
  name: string;
  price: number | string;
  image?: string;
  category?: string;
};

type ShopCatalogClientProps = {
  perfumes: Perfume[];
  initialCategory: string | null;
};

const ShopCatalogClient: React.FC<ShopCatalogClientProps> = ({ perfumes, initialCategory }) => {
  // Filter by category if initialCategory is set
  const filteredPerfumes = initialCategory
    ? perfumes.filter(p => p.category?.toLowerCase() === initialCategory.toLowerCase())
    : perfumes;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Category: {initialCategory ?? "All"}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPerfumes.map((perfume) => (
          <div key={perfume.id} className="p-4 border rounded-lg shadow-md hover:shadow-xl transition">
            {perfume.image && (
              <img
                src={perfume.image}
                alt={perfume.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <h3 className="font-bold">{perfume.name}</h3>
            <p className="text-gray-600">{perfume.price} USD</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopCatalogClient;
