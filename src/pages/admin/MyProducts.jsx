import React, { useEffect, useState } from 'react';
import service from '@/lib/appwrite/service';
import { useNavigate } from 'react-router-dom';

function MyProducts() {
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProductsAndImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAllProducts();

      const grouped = {};

      const imageUrlPromises = data.map(product =>
        product.image ? service.getImageUrl(product.image) : Promise.resolve(null)
      );
      const imageUrls = await Promise.all(imageUrlPromises);

      data.forEach((product, idx) => {
        const title = product.Title || 'Untitled';
        if (!grouped[title]) {
          grouped[title] = {
            ...product,
            images: [],
            ids: [product.$id], // Keep all product IDs for edits/deletes
          };
        } else {
          grouped[title].ids.push(product.$id);
        }
        if (imageUrls[idx]) {
          grouped[title].images.push(imageUrls[idx]);
        }
      });

      setGroupedProducts(Object.values(grouped));
    } catch (error) {
      console.error('Failed to fetch products', error);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndImages();
  }, []);

  const handleDelete = async (ids) => {
    if (window.confirm('Are you sure you want to delete this product and all its images?')) {
      setLoading(true);
      try {
        for (const id of ids) {
          await service.deleteProduct(id);
        }
        await fetchProductsAndImages();
      } catch (error) {
        console.error('Failed to delete products', error);
        setError('Failed to delete products.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : groupedProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {groupedProducts.map((product) => {
            const key = `${product.ids[0]}-${product.Title?.replace(/\s+/g, '-') || 'untitled'}`;

            return (
              <div
                key={key}
                className="
                  relative 
                  p-4 
                  border rounded-lg 
                  shadow-sm 
                  flex flex-col sm:flex-row 
                  gap-5 
                  items-start
                "
              >
                {/* Images */}
                <div className="flex gap-2 overflow-x-auto flex-shrink-0">
                  {product.images.length > 0 ? (
                    product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.Title} image ${idx + 1}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                      />
                    ))
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 animate-pulse rounded" />
                  )}
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold">{product.Title}</h3>
                  <p>
                    <span className="font-bold">Price:</span> ₹{product.price}
                  </p>
                  <p>
                    <span className="font-bold">Category:</span> {product.category}
                  </p>
                  <p>
                    <span className="font-bold">In-Stock:</span> {product.inStock ? 'Yes' : 'No'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex mt-2 sm:mt-4 sm:flex-col gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDelete(product.ids)}
                    className="bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`update-product/${product.ids[0]}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded w-full sm:w-auto cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyProducts;
