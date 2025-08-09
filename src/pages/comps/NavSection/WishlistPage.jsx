import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '@/features/wishlistSlice';
import { addToCartAsync } from '@/features/cartSlice';
import authService from '@/lib/appwrite/auth';
import productService from '@/lib/appwrite/service';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER_IMAGE = '/placeholder.png';

const WishlistPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [productsMap, setProductsMap] = useState({});

    const wishlistItems = useSelector(state => state.wishlist.items) || [];
    const wishlistStatus = useSelector(state => state.wishlist.status);
    const wishlistError = useSelector(state => state.wishlist.error);

    const goToDetails = () => {
        navigate(`/product/${product.id}`)
    }

    useEffect(() => {
        async function loadUser() {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            if (currentUser) {
            dispatch(fetchWishlist(currentUser.$id));
            }
        } catch {
            setUser(null);
        }
        }
        loadUser();
    }, [dispatch]);

    useEffect(() => {
        async function fetchProducts() {
        const productDetails = {};
        for (const item of wishlistItems) {
            try {
            const product = await productService.readproduct(item.productId);
            if (product) productDetails[item.productId] = product;
            } catch (err) {
            // Silently skip missing product
            }
        }
        setProductsMap(productDetails);
        }
        if (wishlistItems.length) fetchProducts();
            else setProductsMap({});
        }, [wishlistItems]);

        const handleRemove = async (docId) => {
            try {
                const user = await authService.getCurrentUser();
                const userId = user?.$id;

                await dispatch(removeFromWishlist(docId)).unwrap();

                if (userId) {
                dispatch(fetchWishlist(userId));
                }
            } catch (error) {
                console.error('Failed to remove wishlist item:', error);
            }
        };

        const handleAddToCart = (product) => dispatch(addToCartAsync({ product, quantity: 1 }));

        if (!user) {
            return (
            <div className="flex flex-col items-center justify-center p-10 min-h-[225px]">
                <p>Please login to see your wishlist.</p>
            </div>
            );
        }
        if (wishlistStatus === 'loading') {
            return (
            <div className="text-center p-10 min-h-[225px]">Loading wishlist...</div>
            );
        }
        if (wishlistError) {
            return (
            <div className="text-center p-10 text-red-600 min-h-[225px]">
                Error loading wishlist: {wishlistError}
            </div>
            );
        }
        if (!wishlistItems.length) {
            return (
            <div className="flex flex-col items-center justify-center p-10 min-h-[225px]">
                <p className="text-lg font-semibold text-gray-700">Your wishlist is empty.</p>
            </div>
            );
        }

    return (
        <div className="max-w-4xl mx-auto p-4 min-h-[225px] rounded-2xl mt-4">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight ml-3">
            My Wishlist
        </h1>
        <ul className="mb-6">
            {wishlistItems.map(item => {
            const product = productsMap[item.productId];
            if (!product) {
                return (
                <li key={item.$id} className="py-6">
                    <div className="text-gray-400 italic text-center">Loading product details...</div>
                </li>
                );
            }

            const imgSrc = product.imageUrls?.[0] || PLACEHOLDER_IMAGE;
            const title = product.Title || 'Unnamed product';
            const price = typeof product.price === 'number' ? product.price : 0;
            return (
                <li
                    key={item.$id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-6 mb-6 border-2 border-gray-200 rounded-xl bg-gray-50/50 transition-shadow"
                >
                    <img
                    src={imgSrc}
                    alt={`Image of ${title}`}
                    className="w-24 h-28 sm:w-28 sm:h-32 object-contain rounded-lg mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
                    style={{ background: 'transparent' }}
                    onError={e => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                    }}
                    />

                    <div className="sm:flex-1 sm:min-w-[240px] mt-0 sm:mt-0">
                    <h2
                        onClick={goToDetails}
                        className="text-xl font-bold text-gray-700 mb-2"
                    >
                        {title}
                    </h2>
                    <p className="text-md text-gray-500 mb-4">
                        Price: <span className="font-bold text-rose-500">₹{(price * 100 / 100).toFixed(2)}</span>
                    </p>
                    <button
                        onClick={() => handleAddToCart(product)}
                        className="py-2 px-6 bg-black/80 text-white font-semibold rounded hover:bg-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 transition shadow w-full sm:w-auto"
                        aria-label={`Add ${title} to cart`}
                    >
                        Add to Cart
                    </button>
                    </div>

                    <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 sm:ml-8 w-full sm:w-auto space-y-4">
                    <button
                        onClick={() => handleRemove(item.$id)}
                        className="py-1 px-5 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 hover:text-rose-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-rose-400 transition shadow cursor-pointer w-full sm:w-auto"
                        aria-label={`Remove ${title} from wishlist`}
                    >
                        Remove
                    </button>
                    </div>
                </li>
                );
            })}
        </ul>
        </div>
    );
};

export default WishlistPage;
