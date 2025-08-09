import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaTag } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync } from '@/features/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/features/wishlistSlice';
import authService from '@/lib/appwrite/auth';

const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/320x400?text=No+Image';

const ShopProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userId, setUserId] = useState(null);

  const images = product.imageUrls && product.imageUrls.length ? product.imageUrls : [DEFAULT_PLACEHOLDER];
  const discount = product.discount;

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCartAsync({ product, quantity: 1 }));
  };

  // Preload images
  useEffect(() => {
    images.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, [images]);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = (e) => { e.target.src = DEFAULT_PLACEHOLDER; };

  const wishlistItems = useSelector(state => state.wishlist.items) || [];
  const wishedItem = wishlistItems?.find(item => item && item.productId === product.$id);
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

  const goToProductDetails = () => {
    navigate(`/product/${product.$id}`, { state: { product } });
  };

  return (
    <div className="rounded-2xl flex flex-col mx-auto sm:ml-0 group items-center justify-center p-0 transition max-w-xs w-full relative sm:hover:shadow-lg">
      {/* Image */}
      <div
        className="w-full aspect-[4/5] flex items-center justify-center overflow-hidden rounded-xl mb-2 relative group cursor-pointer"
        onClick={goToProductDetails}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') goToProductDetails(); }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        {/* Main Image */}
        <img
          src={images[0]}
          alt={product.Title}
          className={`absolute inset-0 max-w-full max-h-full w-full h-full object-contain rounded-xl
            transition-opacity duration-300 z-10
            ${imageLoaded && images[1] ? 'opacity-100 sm:group-hover:opacity-0' : 'opacity-100'}
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Hover Image for desktop */}
        {images[1] && (
          <img
            src={images[1]}
            alt={product.Title + ' alternate view'}
            className={`absolute inset-0 max-w-full max-h-full w-full h-full object-contain rounded-xl
              transition-opacity duration-300 z-20 pointer-events-none
              ${imageLoaded ? 'opacity-0 sm:group-hover:opacity-100' : 'opacity-0'}
            `}
            onError={handleImageError}
            aria-hidden="true"
          />
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-rose-100 transition z-30"
          type="button"
        >
          <FaHeart
            className={`text-lg ${isWishlisted ? 'text-rose-600' : 'text-gray-600 hover:text-rose-500'} transition-colors`}
          />
        </button>

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md z-30 select-none">
            <FaTag className="text-[10px]" />
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-center text-base font-semibold text-gray-800 line-clamp-2 min-h-[3.2em] cursor-pointer hover:underline"
        title={product.Title}
        onClick={goToProductDetails}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') goToProductDetails(); }}
      >
        {product.Title}
      </h3>

      {/* Price */}
      <div className="text-center mt-1 mb-3 min-h-[2.2em] flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
        )}
      </div>

      {/* Add to Cart */}
      <div className="w-full sm:opacity-0 sm:group-hover:opacity-100 transition duration-300">
        <button
          onClick={handleAddToCart}
          type="button"
          className="w-full flex items-center justify-center gap-2 text-sm text-white sm:hover:text-gray-400 bg-gray-900 hover:bg-black px-4 py-2 rounded-full transition cursor-pointer"
        >
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ShopProductCard;
