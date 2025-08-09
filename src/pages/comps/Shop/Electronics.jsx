import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import service from '@/lib/appwrite/service';
import CategoryProductCard from '../ProductsSection/CategoryProductCard';

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
];

const ElectronicsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategoryFromUrl = queryParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryFromUrl);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRangeMax, setPriceRangeMax] = useState(10000);
  const [sortOption, setSortOption] = useState('popularity');

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const data = await service.getAllProducts();

        const filtered = data.filter((recentProduct) =>
          recentProduct.category?.toLowerCase().includes("electronics")
        );
        setProducts(filtered);

        const rawCats = filtered
          .map(p => p.category)
          .filter(Boolean)
          .map(cat => (cat.includes('-') ? cat.split('-')[1] : cat));

        const uniqueCats = [...new Set(rawCats)].map(
          cat => cat.charAt(0).toUpperCase() + cat.slice(1)
        );
        setCategories(['All', ...uniqueCats]);

        const prices = filtered.map(p => (typeof p.price === 'number' ? p.price : 0));
        const maxPriceInProducts = Math.max(...prices);
        setPriceRangeMax(maxPriceInProducts);
        setMaxPrice(maxPriceInProducts);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const filteredProducts = products
    .filter(product => {
      if (!product.category) return false;

      const suffix = product.category.includes('-')
        ? product.category.split('-')[1].toLowerCase()
        : product.category.toLowerCase();

      const normalizedSelectedCat = selectedCategory.toLowerCase();

      const categoryMatch = normalizedSelectedCat === 'all' || suffix === normalizedSelectedCat;

      const price = typeof product.price === 'number' ? product.price : 0;
      const priceMaxOk = price <= Number(maxPrice);

      return categoryMatch && priceMaxOk;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      {/* flex-col on mobile, flex-row on desktop */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 md:gap-10 px-3 md:px-4 py-4 md:py-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 md:min-w-[210px] p-4 md:p-6 bg-white md:bg-transparent rounded md:rounded-none shadow md:shadow-none">
          <h2 className="text-base md:text-lg font-bold mb-4">Filters</h2>

          {/* Category filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-md">Category</h3>
            <ul className="space-y-1 max-h-40 md:max-h-60 overflow-auto">
              {categories.map(cat => (
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
            <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-md">
              Max Price: ₹{maxPrice}
            </h3>
            <input
              type="range"
              min="0"
              max={priceRangeMax}
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
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
            <div className="text-center text-gray-500 py-12">No products match your filters.</div>
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

export default ElectronicsPage;
