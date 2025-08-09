import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import authService from '@/lib/appwrite/auth'
import {
  fetchCartItems,
  updateQuantityAsync,
  removeFromCartAsync,
} from '@/features/cartSlice'
import service from '@/lib/appwrite/service'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PLACEHOLDER_IMAGE = '/placeholder.png'

const CartPage = () => {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [productsMap, setProductsMap] = useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items) || []
  const cartStatus = useSelector((state) => state.cart.status)
  const cartError = useSelector((state) => state.cart.error)

  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
          dispatch(fetchCartItems(currentUser.$id))
        }
      } catch {
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }
    checkUser()
  }, [dispatch])

  useEffect(() => {
    async function fetchProducts() {
      const productDetails = {}
      for (const item of cartItems) {
        try {
          const product = await service.readproduct(item.productId)
          if (product) productDetails[item.productId] = product
        } catch {
          // ignore individual failures
        }
      }
      setProductsMap(productDetails)
    }

    if (cartItems.length) {
      fetchProducts()
    } else {
      setProductsMap({})
    }
  }, [cartItems])

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = productsMap[item.productId]
      const price = product && typeof product.price === 'number' ? product.price : 0
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1
      return sum + price * quantity
    }, 0)
  }, [cartItems, productsMap])

  const increaseQuantity = (item) => {
    if (!user) {
      toast.warn('Please login to update quantity.')
      return
    }
    const newQty = (item.quantity || 1) + 1
    dispatch(updateQuantityAsync({ docId: item.$id, quantity: newQty }))
    toast.success('Quantity increased.')
  }

  const decreaseQuantity = (item) => {
    if (!user) {
      toast.warn('Please login to update quantity.')
      return
    }
    const newQty = (item.quantity || 1) - 1
    if (newQty < 1) {
      dispatch(removeFromCartAsync(item.$id))
      toast.info('Item removed from cart.')
    } else {
      dispatch(updateQuantityAsync({ docId: item.$id, quantity: newQty }))
      toast.success('Quantity decreased.')
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      console.error("Your cart is empty");
      return;
    }
    // Pass cart items in state
    navigate('/checkout', {
      state: { cartItems }
    });
  };

  const handleRemove = (item) => {
    dispatch(removeFromCartAsync(item.$id))
    toast.info('Item removed from cart.')
  }

  if (loadingUser) {
    return <div className="text-center p-10 min-h-[225px]">Loading user information...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-[225px]">
        <p>Please login to see your cart.</p>
      </div>
    )
  }

  if (cartStatus === 'loading') {
    return <div className="text-center p-10 min-h-[225px]">Loading cart...</div>
  }

  if (cartError) {
    return (
      <div className="text-center p-10 min-h-[225px] text-red-600">
        Error loading cart: {cartError}
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 min-h-[225px]">
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-4 min-h-[225px] bg-white rounded-2xl shadow-lg mt-4">
        <h1 className="text-3xl font-extrabold mb-10 text-gray-900 tracking-tight ml-3">
          Your Cart
        </h1>
        <ul>
          {cartItems.map((item) => {
            const product = productsMap[item.productId]
            if (!product) {
              return (
                <li key={item.$id} className="py-6 text-center italic text-gray-400">
                  Loading product details...
                </li>
              )
            }
            const imgSrc = product.imageUrls?.[0] || PLACEHOLDER_IMAGE
            const title = product.Title || 'Unnamed product'
            const price = product.price || 0
            const quantity = item.quantity || 1

            return (
              <li
                key={item.$id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 mb-6 text-center sm:text-start border border-gray-200 rounded-xl bg-gray-50 hover:shadow transition-shadow"
              >
                <img
                  src={imgSrc}
                  alt={`Image of ${title}`}
                  onClick={() => navigate(`/product/${product.id || product.$id}`)}
                  className="w-28 h-32 object-contain rounded-lg cursor-pointer shadow-sm border border-gray-100 mb-4 sm:mb-0 sm:mr-6"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = PLACEHOLDER_IMAGE
                  }}
                />
                <div className="flex-1 w-full">
                  <h2
                    onClick={() => navigate(`/product/${product.id || product.$id}`)}
                    className="text-xl font-bold cursor-pointer hover:text-indigo-600 mb-2"
                  >
                    {title}
                  </h2>
                  <p className="text-lg mb-2">Price: ₹{price.toFixed(2)}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4">
                    <button
                      onClick={() => decreaseQuantity(item)}
                      className="w-10 h-10 rounded-lg bg-gray-200 text-red-500 text-xl flex items-center justify-center hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600"
                      aria-label={`Decrease quantity of ${title}`}
                    >
                      −
                    </button>
                    <span className="text-xl select-none">{quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item)}
                      className="w-10 h-10 rounded-lg bg-gray-200 text-green-600 text-xl flex items-center justify-center hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
                      aria-label={`Increase quantity of ${title}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end justify-between w-full sm:w-auto mt-6 sm:mt-0">
                  <button
                    onClick={() => handleRemove(item)}
                    className="mb-4 px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 shadow focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove ${title} from cart`}
                  >
                    Remove
                  </button>
                  <div className="text-xl font-extrabold text-gray-900">
                    ₹{(price * quantity).toFixed(2)}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <button
            className="px-6 py-3 rounded bg-green-600 text-white text-md font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          <span className=" text-xl sm:text-3xl  font-extrabold text-green-700">
            Total: ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  )
}

export default CartPage
