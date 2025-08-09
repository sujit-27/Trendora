import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "@/features/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/features/wishlistSlice";
import service from "@/lib/appwrite/service";
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaTag } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '@/lib/appwrite/auth';

const DEFAULT_IMAGE = 'https://via.placeholder.com/480x600?text=No+Image';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [userId, setUserId] = useState(null);

  // Redux Wishlist
  const wishlistItems = useSelector(state => state.wishlist.items || []);
  const wishedItem = useMemo(() => (product ? wishlistItems.find(item => item.productId === product?.id || item.productId === product?.$id) : null), [wishlistItems, product]);
  const isWished = Boolean(wishedItem);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await authService.getCurrentUser();
        setUserId(user?.$id);
      } catch {
        setUserId(null);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    setLoading(true);
    service.readproduct(id)
      .then(p => {
        setProduct(p);
        setSelectedSize(p.sizes && p.sizes.length ? p.sizes[0] : null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    for(let i=1; i<=5; i++){
      if(i <= rating) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  const addToCart = () => {
    if(!userId){
      toast.warn("Please login to add to cart.");
      return;
    }
    dispatch(addToCartAsync({ userId, product, quantity: 1, size: selectedSize }));
    toast.success("Added to cart!");
  };

  const toggleWishlist = () => {
    if(!userId){
      toast.warn("Please login to manage wishlist.");
      return;
    }
    if(isWished) {
      dispatch(removeFromWishlist(wishedItem.id));
      toast.info("Removed from wishlist.");
    } else {
      dispatch(addToWishlist({ userId, productId: product.id || product.$id }));
      toast.success("Added to wishlist!");
    }
  };

  const orderNow = () => {
    if(!product.inStock){
      toast.error("Product is out of stock!");
      return;
    }
    navigate('/checkout', { state: { product, quantity: 1, size: selectedSize }});
    toast.success("Proceeding to order...");
  };

  if(loading) return <div className="py-20 text-center text-xl min-h-[225px]">Loading...</div>;
  if(!product) return <div className="py-20 text-center text-xl text-red-600 min-h-[225px]">Product not found.</div>;

  const images = product.imageUrls && product.imageUrls.length ? product.imageUrls : [DEFAULT_IMAGE];
  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  // Dummy reviews
  const reviews = product.reviews || [
    { id: 1, name: "Alice", rating: 5, comment: "Excellent product!" },
    { id: 2, name: "Bob", rating: 4, comment: "Very good quality." },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10" role="main">
        {/* Images Section */}
        <section aria-label="Product images" className="flex flex-col items-center relative">
          <div className="w-full aspect-[4/5] rounded-2xl border mb-4 overflow-hidden relative bg-gray-100">
            {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200"></div>}
            <img src={images[selectedImage]} alt={product.Title} onLoad={() => setImageLoaded(true)} onError={e => e.target.src = DEFAULT_IMAGE} className="object-contain w-full h-full" />
          </div>
          <div className="flex gap-2 w-full justify-center" role="list" aria-label="Product thumbnails">
            {images.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-16 h-16 rounded-lg border ${idx === selectedImage ? 'ring-2 ring-indigo-600' : 'border-gray-300'} bg-gray-100`} aria-current={idx === selectedImage} aria-label={`View image ${idx + 1}`}>
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-contain w-full h-full" />
              </button>
            ))}
          </div>
          <button
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
                e.stopPropagation();
                toggleWishlist();
            }}
            className={`absolute top-4 right-4 focus:outline-none transition-colors duration-300 ${
                isWished ? "text-pink-600" : "text-gray-400 hover:text-pink-600"
            }`}
            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
            >
            <FaHeart className="text-4xl drop-shadow-lg" />
          </button>
        </section>

        {/* Product Info Section */}
        <section aria-label="Product details" className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">{product.Title}</h1>
          <div className="flex items-center gap-2" aria-label={`Rated ${averageRating} out of 5`}>
            {renderStars(4)}
            <span className="text-gray-600 text-sm ml-2">({11} reviews)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-amber-600">₹{product.price}</span>
            {product.originalPrice && <span className="line-through text-gray-400">₹{product.originalPrice}</span>}
            {product.discount && (
              <span className="px-2 py-1 ml-2 text-xs font-semibold bg-red-500 text-white rounded">{product.discount}% OFF</span>
            )}
          </div>
          <p className={`font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
            {product.inStock ? "In stock" : "Out of stock"}
          </p>
          <p className="text-sm text-gray-500">Category: <span className="font-medium">{product.category}</span></p>
          {product.sizes && product.sizes.length > 0 && (
            <fieldset>
              <legend className="font-semibold mb-2">Select Size</legend>
              <div className="flex gap-3">
                {product.sizes.map(size => (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`px-3 py-1 rounded-full border ${selectedSize === size ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border-gray-300'}`} aria-pressed={selectedSize === size}>
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <p className="text-gray-700 whitespace-pre-line">{product.description || 'No description available.'}</p>
          <button onClick={addToCart} className="mt-6 w-full py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">
            <FaShoppingCart className="inline mr-2" /> Add to Cart
          </button>
          <button
            onClick={orderNow}
            disabled={!product.inStock}
            className={`w-full py-3 rounded-lg ${product.inStock ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold`}
            aria-disabled={!product.inStock}
          >
            Order Now
          </button>
          <button onClick={() => navigate(-1)} className="mt-6 text-indigo-600 hover:underline w-fit">
            ← Back to Products
          </button>
        </section>
      </main>
    </>
  );
};

export default ProductDetailsPage;
