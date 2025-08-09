import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { addToWishlist, removeFromWishlist } from '@/features/wishlistSlice'; // Ensure correct path
import { addToCartAsync } from '@/features/cartSlice';
import authService from '@/lib/appwrite/auth';

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const images = product.imageUrls || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch current user ID on mount
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUserId(currentUser?.$id || null);
      } catch {
        setUserId(null);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    let timer;
    if (imageLoaded) {
      timer = setTimeout(() => setLoading(false), 300);
    }
    return () => clearTimeout(timer);
  }, [imageLoaded]);

  // Wishlist slice
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  const wishedItem = wishlistItems.find((item) => item && item.productId === product.$id);
  const isWishlisted = Boolean(wishedItem);

  // Wishlist toggle handler
  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!product || !product.$id) return;

    if (!userId) {
      console.error('Please login to manage your wishlist');
      return;
    }

    try {
      if (isWishlisted && wishedItem && wishedItem.$id) {
        dispatch(removeFromWishlist(wishedItem.$id));
      } else {
        dispatch(addToWishlist({ userId, productId: product.$id }));
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    dispatch(addToCartAsync({ product, quantity: 1 }));
  };

  // Navigate to product details page on click
  const goToProductDetails = () => {
    navigate(`/product/${product.$id}`, { state: { product } });
  };

  return (
    <div
      className="flex flex-col gap-2 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative bg-white shadow rounded-md hover:shadow-lg transition-all duration-300 overflow-hidden aspect-[3/4] cursor-pointer"
        onClick={goToProductDetails}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') goToProductDetails();
        }}
      >
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 animate-pulse rounded-md z-10" />
        )}

        <img
          src={hovered && images[1] ? images[1] : images[0]}
          alt={product.Title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <button
          onClick={(e) => toggleWishlist(e)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-rose-100 transition z-30"
          type="button"
        >
          <FaHeart
            className={`text-lg ${
              isWishlisted ? 'text-rose-600' : 'text-gray-600 hover:text-rose-500'
            } transition-colors`}
          />
        </button>
      </div>

      <div>
        <h4
          className="mt-1 text-[16px] font-bold text-gray-900 text-center cursor-pointer hover:underline"
          onClick={goToProductDetails}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goToProductDetails();
          }}
        >
          {hovered || window.innerWidth < 640 ? (
            <div className="flex flex-col items-center">
              <span className="text-gray-900 font-semibold">{product.Title}</span>
              <button
                className="flex flex-row gap-2 mt-2 items-center sm:hover:scale-105 transition-transform"
                onClick={handleAddToCart}
                type="button"
              >
                <FaShoppingCart className="text-gray-500 cursor-pointer" />
                <span className="text-gray-500 text-sm hover:underline cursor-pointer">
                  Add to cart
                </span>
              </button>
            </div>
          ) : (
            <span className="block text-gray-900 font-semibold">{product.Title}</span>
          )}
        </h4>
      </div>
    </div>
  );
};

export default ProductCard;
