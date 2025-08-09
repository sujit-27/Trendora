import React, { useEffect, useState } from 'react';
import service from '@/lib/appwrite/service';
import CategoryProductCard from '../ProductsSection/CategoryProductCard';

const SUBCATEGORIES = [
  "Ring",
  "Necklace",
  "Bracelet",
  "Earring",
  "Bangle",
  "Pendant",
  "Brooch",
  "Anklet",
  "Nosepin",
  "Mangalsutra",
  "Others"
];
const CATEGORY_OPTIONS = ["All", ...SUBCATEGORIES];

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' }
];

const JewelleryAndAccessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRangeMax, setPriceRangeMax] = useState(10000);
  const [sortOption, setSortOption] = useState("popularity");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await service.getAllProducts();

        const filtered = allProducts.filter(product => {
          if (!product.category) return false;
          const subcat = product.category.includes('-')
            ? product.category.split('-')[1].trim().toLowerCase()
            : product.category.trim().toLowerCase();
          return SUBCATEGORIES.some(opt => subcat === opt.toLowerCase());
        });

        setProducts(filtered);

        // Calculate price slider max
        const prices = filtered.map(p => (typeof p.price === "number" ? p.price : 0));
        const maxP = Math.max(...prices, 0);
        setPriceRangeMax(maxP);
        setMaxPrice(maxP);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => {
      if (!product.category) return false;
      const subcat = product.category.includes('-')
        ? product.category.split('-')[1].trim().toLowerCase()
        : product.category.trim().toLowerCase();

      const categoryMatch =
        selectedCategory === "All" || subcat === selectedCategory.toLowerCase();

      const price = typeof product.price === "number" ? product.price : 0;
      const priceMatch = price <= maxPrice;

      return categoryMatch && priceMatch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "popularity":
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

  return (
    <div className="min-h-screen">
      {/* Container flex-col on mobile, flex-row on md+ desktops */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 md:gap-10 px-4 py-8">

        {/* Sidebar - full width mobile, fixed width desktop */}
        <aside className="w-full md:w-72 min-w-[210px] p-4 md:p-6 bg-white md:bg-transparent rounded md:rounded-none shadow md:shadow-none">
          <h2 className="text-base md:text-lg font-bold mb-4">Filters</h2>
          {/* Category filter */}
          <div className="mb-7">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-md">Category</h3>
            <ul className="space-y-1 max-h-40 md:max-h-60 overflow-auto">
              {CATEGORY_OPTIONS.map(cat => (
                <li key={cat}>
                  <label className="flex gap-2 items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-emerald-600"
                      name="category"
                    />
                    <span className="text-gray-600 text-sm md:text-base">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {/* Price filter */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-md">Max Price: ₹{maxPrice}</h3>
            <input
              type="range"
              min="0"
              max={priceRangeMax}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full h-0.5 accent-rose-500"
              step="1"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>₹{priceRangeMax}</span>
            </div>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1">
          {/* Sorting */}
          <div className="flex flex-wrap gap-3 justify-end items-center mb-5">
            <span className="font-semibold mr-2 text-gray-700">Sort by:</span>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm outline-emerald-600 bg-white"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {/* Product Grid */}
          {loading ? (
            <div className="py-12 text-gray-600 text-xl text-center">Loading products...</div>
          ) : error ? (
            <div className="py-12 text-red-600 text-center">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No products match your filters.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-7">
              {filteredProducts.map(product => (
                <li key={product.$id}>
                  <CategoryProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default JewelleryAndAccessories;
