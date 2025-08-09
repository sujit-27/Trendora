import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync } from '@/features/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/features/wishlistSlice'; // Adjust path if needed
import authService from '@/lib/appwrite/auth';

const RecentProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userId, setUserId] = useState(null);

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ["/placeholder.png"];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Preload images for hover effect
  useEffect(() => {
    const preloadImage = (url) => {
      const img = new Image();
      img.src = url;
    };
    images.forEach(preloadImage);
  }, [images]);

  // Fetch logged-in user ID once on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUserId(currentUser.$id || null);
      } catch {
        setUserId(null);
      }
    }
    fetchUser();
  }, []);

  const wishlistItems = useSelector(state => state.wishlist.items) || [];
  const wishedItem = wishlistItems.find(item => item && item.productId === product.$id);
  const isWishlisted = Boolean(wishedItem);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (!product || !product.$id) return;

    if (!userId) {
      console.error('Please login to manage your wishlist');
      return;
    }

    if (isWishlisted && wishedItem && wishedItem.$id) {
      dispatch(removeFromWishlist(wishedItem.$id));
    } else {
      dispatch(addToWishlist({ userId, productId: product.$id }));
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCartAsync({ product, quantity: 1 }));
  };

  const handleImageLoad = () => setImageLoaded(true);

  // Navigate to product details page when image or title clicked
  const goToProductDetails = () => {
    navigate(`/product/${product.$id}`, { state: { product } });
  };

  return (
    <div className="flex flex-col gap-2 group relative w-full sm:max-w-[300px] p-5 sm:p-0 mx-auto shadow-md sm:shadow-none">
      {/* Image Container */}
      <div
        className="relative h-80 aspect-[3/4] rounded-md overflow-hidden cursor-pointer"
        onClick={goToProductDetails}
        role="link"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') goToProductDetails(); }}
      >
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md z-10" />
        )}

        {/* First Image */}
        <img
          src={images[0]}
          alt={product.Title}
          className={`absolute inset-0 w-full object-cover transition-opacity duration-300 rounded-md z-20 ${
            imageLoaded ? 'opacity-100 group-hover:opacity-0' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={e => { e.target.src = "/placeholder.png"; }}
        />

        {/* Second Image (on hover) */}
        {images[1] && (
          <img
            src={images[1]}
            alt={`${product.Title} Hover`}
            className={`absolute inset-0 w-full object-cover transition-opacity duration-300 rounded-md z-10 ${
              imageLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
            }`}
            onError={e => { e.target.src = "/placeholder.png"; }}
            aria-hidden="true"
          />
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
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

      {/* Title */}
      <h4
        className="text-center text-lg font-bold text-gray-800 px-1 truncate cursor-pointer hover:underline"
        title={product.Title}
        onClick={goToProductDetails}
        role="link"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') goToProductDetails(); }}
      >
        {product.Title}
      </h4>

      {/* Price */}
      <div className="text-center text-sm font-medium text-gray-700">
        <span className="text-md text-gray-500">
          ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
        </span>
      </div>

      {/* Add to Cart Button */}
      <div className="flex justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300">
        <button
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          onClick={handleAddToCart}
          type="button"
        >
          <FaShoppingCart className="cursor-pointer" />
          <span className="text-gray-500 cursor-pointer hover:underline">Add to cart</span>
        </button>
      </div>
    </div>
  );
};

export default RecentProductCard;
