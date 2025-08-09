import service from '@/lib/appwrite/service';
import React, { useEffect, useMemo, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import ShopCard from './ShopCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([300, 200000]); // min and max in your dataset
  const [priceValue, setPriceValue] = useState(200000); // currently selected max price
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState('latest'); // Add controlled sort state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndImages = async () => {
      const data = await service.getAllProducts();

      const categoryCounts = {};

      data.forEach(product => {
        const mainCategory = product.category?.split('-')[0].trim() || 'Unknown';
        categoryCounts[mainCategory] = (categoryCounts[mainCategory] || 0) + 1;
      });

      const uniqueCategories = Object.keys(categoryCounts);
      const categoriesWithCount = uniqueCategories.map(category => ({
        name: category,
        count: categoryCounts[category]
      }));

      setCategories(categoriesWithCount);
      setProducts(data);
      setLoading(false);
    };

    fetchProductsAndImages();
  }, []);

  // Derived filtered and sorted products list
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Search filter (case-insensitive)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.Title?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => {
        const mainCat = product.category?.split('-')[0].trim();
        return mainCat === selectedCategory;
      });
    }

    // Price filter (assuming product.price is number)
    filtered = filtered.filter(product => product.price <= priceValue);

    // Sorting
    filtered = [...filtered]; // create a shallow copy to sort

    switch (sortOption) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'low-to-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-to-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceValue, sortOption]);

  return (
    <>
      <main>
        <div className="w-full mx-auto">
          <div className="p-12 text-center bg-gradient-to-r from-rose-200 via-rose-100 to-rose-200">
            <h1 className="text-4xl font-bold text-black/80">Shop</h1>
            <p className="text-sm font-semibold mt-4 text-gray-500">Home/Shop</p>
          </div>
        </div>

        {/* Responsive container: column on mobile, row from md and above */}
        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row gap-10 px-4">

          {/* Sidebar filters - full width mobile, fixed width on desktop */}
          <aside className="w-full md:w-72 pr-0 md:pr-10 mt-5 flex flex-col gap-10">

            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <input
                type="search"
                placeholder="Search Products..."
                className="w-full md:w-60 p-3 pl-10 bg-gray-300/70 rounded-3xl placeholder:text-blue-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoMdSearch size={20} className="absolute left-3 top-3 text-blue-900 opacity-80" />
            </div>

            <div className="w-full max-w-md mx-auto md:mx-0">
              <label className="text-xl font-semibold text-gray-800 block mb-2">Filter by Price</label>
              <input
                type="range"
                className="h-0.5 w-full md:w-60 accent-rose-600"
                min={priceRange[0]}
                max={priceRange[1]}
                value={priceValue}
                onChange={(e) => setPriceValue(Number(e.target.value))}
              />
              <div className="mt-2 flex flex-wrap md:flex-nowrap items-center gap-2 max-w-md md:max-w-full">
                <button
                  className="text-white bg-purple-800 rounded-4xl px-5 py-2 font-semibold cursor-pointer hover:bg-purple-700"
                  onClick={() => setPriceValue(priceRange[1]) /* reset to max */}
                >
                  Reset
                </button>
                <span className="font-semibold text-sm">Price: ₹{priceRange[0]} - ₹{priceValue}</span>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto md:mx-0">
              <h1 className="text-xl font-semibold text-gray-800 mb-3">Product Categories</h1>
              <div className="flex flex-col gap-3 max-w-md md:max-w-full">
                <label
                  className="cursor-pointer capitalize w-full flex justify-between"
                >
                  <span
                    onClick={() => setSelectedCategory(null)}
                    className={`text-gray-900 ${!selectedCategory && 'font-bold'}`}
                  >
                    All
                  </span>
                  <span>({products.length})</span>
                </label>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <label
                      key={index}
                      className={`flex justify-between cursor-pointer capitalize w-full 
                        ${selectedCategory === category.name ? 'font-bold text-blue-600' : 'text-gray-900'}`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <span>{category.name}</span>
                      <span>({category.count})</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 max-w-md md:max-w-full">No categories found.</p>
                )}
              </div>
            </div>

          </aside>

          {/* Main products area */}
          <div className="w-full mt-3 md:mt-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <p className="font-semibold text-gray-800">
                Showing {filteredAndSortedProducts.length} results
              </p>
              <div className="relative w-full max-w-xs md:w-48">
                <select
                  className="block appearance-none w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-lg py-3 px-4 pr-8 leading-tight shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="latest">Sort by Latest</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.167l3.71-3.937a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <ShopCard products={filteredAndSortedProducts} />
          </div>

        </div>
      </main>
    </>
  );
};

export default Shop;
