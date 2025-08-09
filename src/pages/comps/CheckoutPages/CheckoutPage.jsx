import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaEdit, FaCheck, FaHome ,FaTimes, FaShoppingBasket } from "react-icons/fa";
import {
  updateQuantityAsync,
  removeFromCartAsync,
} from "@/features/cartSlice";
import service from "@/lib/appwrite/service";

const DELIVERY_FEE = 1.5;
const GST_RATE = 0.12;

const CheckoutPage = () => {
    const cartDbItems = useSelector((state) => state.cart.items || []);
    const status = useSelector((state) => state.cart.status);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isSingleCheckout = location.state?.product !== undefined;
    const singleProductId = location.state?.product?.$id;

    const [contactEmail, setContactEmail] = useState("");
    const [shippingFirstName, setShippingFirstName] = useState("");
    const [shippingLastName, setShippingLastName] = useState("");
    const [shippingPhone, setShippingPhone] = useState("");

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Address: Simulate loaded address, replace with real fetch in prod
    const [savedAddress, setSavedAddress] = useState(""); 
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editableAddress, setEditableAddress] = useState("");

    
    useEffect(() => {
    const getAddress = async () => {
        try {
        setLoading(true);
        const addressDoc = await service.fetchUserAddressById();
        console.log(addressDoc);
        

        if (addressDoc) {
            const formattedAddress = `${addressDoc.address}
${addressDoc.city}
${addressDoc.state} - ${addressDoc.pinCode}`;
setEditableAddress(formattedAddress);
            setSavedAddress(formattedAddress);
            setEditableAddress(formattedAddress);
        } else {
            setSavedAddress(null);
            setEditableAddress("");
        }

        setIsEditingAddress(false);
        setLoading(false);
        } catch (error) {
        console.error("Error:", error);
        setLoading(false);
        }
    };

    getAddress();
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function fetchItems() {
        setLoading(true);

        if (isSingleCheckout && singleProductId) {
            const product = await service.readproduct(singleProductId);
            if (!cancelled) {
            setCheckoutItems([
                {
                product,
                quantity: location.state.quantity || 1,
                size: location.state.size || null,
                },
            ]);
            setLoading(false);
            }
        } else {
            const promises = cartDbItems.map(async (item) => {
            const product = await service.readproduct(item.productId);
            return product ? { ...item, product } : null;
            });
            const resolved = (await Promise.all(promises)).filter(Boolean);
            if (!cancelled) {
            setCheckoutItems(resolved);
            setLoading(false);
            }
        }
        }
        fetchItems();
        return () => {
        cancelled = true;
        };
    }, [isSingleCheckout, singleProductId, cartDbItems, location.state]);

    const handleQtyChange = (item, dir) => {
        let newQty = dir === "inc" ? item.quantity + 1 : item.quantity - 1;
        if (newQty < 1) return;
        dispatch(updateQuantityAsync({ docId: item.$id, quantity: newQty }));
    };

    const handleRemove = (item) => {
        if (isSingleCheckout) return;
        dispatch(removeFromCartAsync(item.$id));
    };

    // Address edit handlers
    const toggleAddressEdit = () => setIsEditingAddress(!isEditingAddress);
    const handleAddressChange = (e) => setEditableAddress(e.target.value || "");

    function saveEditedAddress() {
        if (editableAddress.trim().length < 10) {
        console.error("Please enter a valid delivery address.");
        return;
        }
        setSavedAddress(editableAddress);
        setIsEditingAddress(false);
    }

    const isAddressValid = editableAddress.length >= 10;

    // Cart totals calculations (match your screenshot's GST and delivery fee)
    const subtotal = checkoutItems.reduce(
        (sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 1)), 0
    );
    const gst = +(subtotal * GST_RATE).toFixed(2);
    const total = +(subtotal + DELIVERY_FEE + gst).toFixed(2);

    if (loading || status === "loading") {
        return <div className="p-12 text-center min-h-[300px] text-gray-600 text-lg font-medium">
        Loading your checkout...
        </div>;
    }

    if (!checkoutItems.length) {
        return <div className="p-12 text-center min-h-[300px] text-gray-600">
        No items to checkout.
        </div>;
    }

    const makePayment = async () => {
        const amount = total * 100;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount,
            currency: "INR",
            name: "Trendora",
            description: "Test Transaction",
            image: "/logo.png",
            handler: function (response) {
            toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

            navigate("/paymentresult", {
                state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                payerName: `${shippingFirstName} ${shippingLastName}`,
                payerEmail: contactEmail,
                payerPhone: shippingPhone,
                amount: amount / 100,
                },
            });
            },
            prefill: {
            name: `${shippingFirstName} ${shippingLastName}`,
            email: contactEmail,
            contact: shippingPhone,
            },
            theme: {
            color: "#3399cc",
            },
        };

        if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            console.error("Razorpay SDK not loaded. Please check your setup.");
        }
    };
    
    return (
        <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Main Products List (2/3) */}
        <section className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow space-y-7">
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
            {checkoutItems.map((item, idx) => (
                <div
                key={item.$id || idx}
                className="flex flex-row items-center sm:items-start gap-4 sm:gap-5 border-b border-gray-100 pb-5 pt-5 last:border-b-0"
                >
                <img
                    src={item.product.imageUrls?.[0] || '/placeholder.png'}
                    alt={item.product.Title || item.product.name || 'Product'}
                    className="w-24 h-24 object-contain rounded-xl border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <Link
                    to={`/product/${item.product.$id}`}
                    className="font-semibold text-base text-gray-800 truncate block sm:inline"
                    title={item.product.Title} // show full title on hover
                    >
                    {item.product.Title}
                    </Link>
                    {item.size && (
                    <p className="text-xs text-gray-500 mt-1 sm:mt-0">Size: {item.size}</p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                        aria-label="Decrease quantity"
                        onClick={() => handleQtyChange(item, "dec")}
                        disabled={item.quantity <= 1 || status === "loading"}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 
                        disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
                    >
                        <FaMinus />
                    </button>
                    <span className="font-bold text-lg">{item.quantity}</span>
                    <button
                        aria-label="Increase quantity"
                        onClick={() => handleQtyChange(item, "inc")}
                        disabled={status === "loading"}
                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 
                        disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
                    >
                        <FaPlus />
                    </button>
                    {!isSingleCheckout && (
                        <button
                        aria-label="Remove from cart"
                        onClick={() => handleRemove(item)}
                        disabled={status === "loading"}
                        className="ml-0 sm:ml-5 text-red-600 hover:text-red-800 flex items-center text-xs px-2 gap-1 font-semibold mt-2 sm:mt-0"
                        >
                        <FaTrash />
                        Remove
                        </button>
                    )}
                    </div>
                </div>
                <div className="text-right font-bold text-base text-gray-900 min-w-[70px] mt-2 sm:mt-0">
                    ₹{((item.product.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
                </div>
            ))}
        </section>

        {/* Sidebar: Address + Payment Summary (1/3, sticky right on large screens) */}
        <aside className="relative">
            <div className="sticky top-8 bg-gray-50 p-7 rounded-2xl shadow-lg space-y-7 min-w-[300px]">
            {/* ADDRESS BLOCK */}
            <div className="flex items-start gap-3 border-b border-gray-200 pb-5">
                <FaHome className="text-indigo-500 mt-1 text-xl" />
                <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Delivery Address</div>
                    <button
                    className="ml-1 flex items-center gap-1.5 px-2 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition"
                    onClick={toggleAddressEdit}
                    type="button"
                    >
                    {isEditingAddress
                        ? (<><FaTimes className="inline cursor-pointer" />Cancel</>)
                        : savedAddress
                        ? (<><FaEdit className="inline cursor-pointer" />Change</>)
                        : (<><FaPlus className="inline cursor-pointer" />Add</>)
                    }
                    </button>
                </div>
                {/* Show address or editor */}
                {!isEditingAddress && savedAddress && (
                    <pre className="font-medium text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-100 border border-gray-200 rounded-lg p-3 mt-1">
                    {savedAddress}
                    </pre>
                )}
                {isEditingAddress && (
                    <div className="mt-2">
                    <textarea
                        value={editableAddress}
                        onChange={handleAddressChange}
                        placeholder="Enter your delivery address here..."
                        rows={4}
                        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    />
                    <button
                        disabled={!isAddressValid}
                        onClick={saveEditedAddress}
                        className={`mt-2 float-right px-4 py-1.5 rounded bg-indigo-600 text-white font-bold flex items-center gap-2 transition
                        ${isAddressValid ? "hover:bg-indigo-700" : "opacity-50 cursor-not-allowed"}`}
                        type="button"
                    >
                        <FaCheck /> Save
                    </button>
                    </div>
                )}
                {!isEditingAddress && !savedAddress && (
                    <div className="mt-2 text-gray-500 text-sm font-medium italic">
                    No delivery address set yet.
                    </div>
                )}
                </div>
            </div>

            {/* PAYMENT SUMMARY BLOCK */}
            <div>
                <div className="text-base font-bold mb-2">Cart Totals</div>
                <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-yellow-100 px-2 py-1 rounded">
                    <span>Delivery</span>
                    <span className="font-semibold">₹{DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-yellow-100 px-2 py-1 rounded">
                    <span>GST 12%</span>
                    <span className="font-semibold">₹{gst}</span>
                </div>
                <hr className="my-2 border-gray-300" />
                <div className="flex justify-between text-lg font-extrabold">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>
                </div>
                <button
                className={`w-full mt-6 py-3 rounded-xl text-base font-bold ${
                    isAddressValid
                    ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } transition`}
                onClick={isAddressValid && makePayment}
                disabled={!isAddressValid || status === "loading"}
                type="submit"
                >
                Pay ₹{total}
                </button>
                <div className="flex flex-col items-center mt-8">
                    <div className="flex items-center w-full max-w-md px-4">
                        <div className="flex-grow h-px bg-gray-300" />
                        <span className="mx-4 text-gray-600 font-medium">OR</span>
                        <div className="flex-grow h-px bg-gray-300" />
                    </div>
                    <button
                        onClick={() => {
                            if (isSingleCheckout && singleProductId) {
                            // Pass single product info
                            navigate("/proceedcheckout", {
                                state: {
                                product: location.state.product,
                                quantity: location.state.quantity || 1,
                                size: location.state.size || null,
                                },
                            });
                            } else {
                            // Pass entire cart items
                            navigate("/proceedcheckout", {
                                state: {
                                cart: checkoutItems,
                                },
                            });
                            }
                        }}
                        className="cursor-pointer text-gray-400 mt-3 underline hover:text-gray-600"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
            </div>
            <button
            onClick={() => navigate(-1)}
            className="mt-6 w-full text-indigo-600 underline text-sm hover:text-indigo-800 transition cursor-pointer"
            type="button"
            >
            ← Back to Shop
            </button>
        </aside>
        </main>
    );
};

export default CheckoutPage;
