import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'
import { addToWishlist, removeFromWishlist } from '@/features/wishlistSlice'
import { addToCartAsync } from '@/features/cartSlice'
import authService from '@/lib/appwrite/auth'
import { toast } from 'react-toastify'


const DEFAULT_PLACEHOLDER = '/placeholder.png'


const CategoryProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [userId, setUserId] = useState(null)


  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await authService.getCurrentUser()
        setUserId(currentUser?.$id || null)
      } catch (e) {
        console.error('Failed to fetch currentUser', e)
        setUserId(null)
      }
    }
    fetchUser()
  }, [])


  const images = product.imageUrls?.length ? product.imageUrls : [DEFAULT_PLACEHOLDER]
  const wishlistItems = useSelector((state) => state.wishlist.items) || []
  const wishedItem = wishlistItems.find((item) => item?.productId === product?.$id)
  const isWishlisted = Boolean(wishedItem)


  const toggleWishlist = (e) => {
    e.stopPropagation()
    if (!userId) {
      toast.warning('Please login to manage your wishlist')
      return
    }
    if (!product?.$id) return
    if (isWishlisted && wishedItem?.$id) {
      dispatch(removeFromWishlist(wishedItem.$id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(addToWishlist({ userId, productId: product.$id }))
      toast.success('Added to wishlist')
    }
  }


  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!userId) {
      toast.warning('Please login to add to cart')
      return
    }
    dispatch(addToCartAsync({ userId, product, quantity: 1 }))
    toast.success('Added to cart')
  }


  const handleCardClick = () => {
    navigate(`/product/${product.$id}`)
  }


  return (
    <div
      onClick={handleCardClick}
      className="shadow rounded-xl flex items-center p-2.5 sm:p-4 gap-3 sm:gap-4 w-full max-w-5xl mx-auto cursor-pointer hover:shadow-lg transition"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick()
      }}
      aria-label={`View details for ${product.Title}`}
    >
      {/* Image */}
      <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden relative">
        <img
          src={images[0]}
          alt={product.Title || 'Product Image'}
          loading="lazy"
          className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = DEFAULT_PLACEHOLDER
          }}
        />
        {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      </div>


      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-lg font-semibold text-gray-800 truncate"
          title={product.Title}
          onClick={handleCardClick}
        >
          {product.Title}
        </h4>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
      </div>


      {/* Price & Actions */}
      <div className="flex flex-col items-end gap-3 min-w-fit">
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-rose-50 transition cursor-pointer"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <FaHeart
            className={`text-lg transition-colors ${
              isWishlisted ? 'text-rose-600' : 'text-gray-400 hover:text-rose-500'
            }`}
          />
        </button>


        <span className="text-lg font-semibold text-black mb-1">
          ₹{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
        </span>


        {product.inStock === false && <span className="text-red-600 text-sm mb-1">Currently Out Of Stock</span>}


        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded shadow transition cursor-pointer disabled:opacity-50"
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default CategoryProductCard
