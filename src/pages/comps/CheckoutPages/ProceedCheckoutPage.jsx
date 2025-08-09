import service from "@/lib/appwrite/service";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "@/lib/appwrite/auth";
import { toast } from "react-toastify";

const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

const DELIVERY_FEE = 1.5;
const GST_RATE = 0.12;

export default function ProceedCheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderDocId, setOrderDocId] = useState(null);

    const isSingleCheckout = !!(
        location.state && location.state.product && location.state.product.$id
    );

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        getValues,
    } = useForm({
        mode: "onChange",
        defaultValues: {
        contactEmail: "",
        shippingCountry: "India",
        shippingFirstName: "",
        shippingLastName: "",
        shippingAddress: "",
        shippingAddress2: "",
        shippingCity: "",
        shippingState: "",
        shippingPin: "",
        shippingPhone: "",
        sameAddress: false,
        billingCountry: "India",
        billingFirstName: "",
        billingLastName: "",
        billingAddress: "",
        billingAddress2: "",
        billingCity: "",
        billingState: "",
        billingPin: "",
        billingPhone: "",
        paymentMethod: "cod",
        },
    });

    // Watch sameAddress checkbox to hide/show billing address form
    const sameAddress = watch("sameAddress");
    const paymentMethod = watch("paymentMethod");

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
        try {
            setLoading(true);
            if (location.state) {
            if (isSingleCheckout) {
                const productId = location.state.product.$id;
                const fetchedProduct = await service.readproduct(productId);
                if (!cancelled && fetchedProduct) {
                setProducts([
                    {
                    id: fetchedProduct.$id,
                    name: fetchedProduct.Title || fetchedProduct.name || "Product",
                    price: fetchedProduct.price || 0,
                    image: (fetchedProduct.imageUrls || [])[0] || "",
                    color: fetchedProduct.color || "",
                    size: location.state.size || "",
                    quantity: location.state.quantity || 1,
                    },
                ]);
                }
            } else if (Array.isArray(location.state.cart)) {
                const fetchedProducts = await Promise.all(
                location.state.cart.map(async (item) => {
                    const p = await service.readproduct(item.product.$id);
                    return {
                    id: p.$id,
                    name: p.Title || p.name || "Product",
                    price: p.price || 0,
                    image: (p.imageUrls || [])[0] || "",
                    color: p.color || "",
                    size: item.size || "",
                    quantity: item.quantity || 1,
                    };
                })
                );
                if (!cancelled) setProducts(fetchedProducts);
            } else {
                setProducts([]);
            }
            }
            if (!cancelled) setLoading(false);
        } catch (error) {
            if (!cancelled) {
            setLoading(false);
            setProducts([]);
            console.error(error);
            }
        }
        }
        fetchData();

        return () => {
            cancelled = true;
            };
        }, [location.state, isSingleCheckout]);

    // Calculate totals
    const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = +(subtotal * GST_RATE).toFixed(2);
    const total = +(subtotal + DELIVERY_FEE + gst).toFixed(2);

    useEffect(() => {
        if (sameAddress) {
        [
            "Country",
            "FirstName",
            "LastName",
            "Address",
            "Address2",
            "City",
            "State",
            "Pin",
            "Phone",
        ].forEach((field) => {
            setValue(`billing${field}`, watch(`shipping${field}`));
        });
        }
    }, [sameAddress, setValue, watch]);

    const onSubmit = async (data) => {
        console.log(data);
        if (products.length === 0) return;

        const user = await authService.getCurrentUser();
        const userId = user.$id;

        const orderPayload = {
            firstName: data.shippingFirstName,
            lastName: data.shippingLastName,
            pinCode: data.shippingPin ,
            city: data.shippingCity,
            state: data.shippingState,
            address: data.shippingAddress,
            products: JSON.stringify(products),
            totalAmount: total,
            email: data.contactEmail,
            phone: data.shippingPhone,
            status: "pending",
            userId: userId,
            orderDate: new Date().toISOString(),
            paymentStatus: "unpaid", 
        };

        try {
            const orderResponse = await service.createOrder(orderPayload);
            setOrderDocId(orderResponse.$id);
            toast.success("Order placed successfully:", orderResponse);

        } catch (err) {
            console.error("Order placement failed:", err);
        }
    };

    if (loading) {
        return (
        <div className="flex h-screen justify-center items-center text-lg text-gray-600">
            Loading...
        </div>
        );
    }

    if (!products.length) {
        return (
        <div className="flex h-screen justify-center items-center text-lg text-gray-600">
            No products in checkout.
        </div>
        );
    }

    const makePayment = async (orderDocId) => {
    const { contactEmail, shippingFirstName, shippingLastName, shippingPhone } = getValues();
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
                    orderId: orderDocId,
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
        modal: {
            escape: true,
            backdropclose: false,
            handleback: true,
        },
        payment_method: {
            upi: true,
            netbanking: true,
            card: true,
            wallet: true,
            emi: true,
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
        <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-3 text-gray-900">Checkout</h1>
            <p className="mb-10 text-gray-600 tracking-wide">Home / Checkout</p>

            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left / Main Section */}
                <section className="md:col-span-2 space-y-10">
                {/* Contact */}
                <section className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Contact Information
                    </h2>
                    <input
                    type="email"
                    placeholder="Email address"
                    {...register("contactEmail", {
                        required: "Email is required",
                        pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address",
                        },
                    })}
                    className={`w-full p-3 border rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.contactEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={errors.contactEmail ? "true" : "false"}
                    />
                    {errors.contactEmail && (
                    <p className="text-red-600 mt-1">{errors.contactEmail.message}</p>
                    )}
                </section>

                {/* Shipping Address */}
                <section className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                    Shipping Address
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                    <select
                        {...register("shippingCountry")}
                        aria-label="Country"
                        className="col-span-2 border border-gray-300 rounded-lg p-3 appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        defaultValue="India"
                    >
                        <option value="India">India</option>
                    </select>
                    <input
                        type="text"
                        placeholder="First name"
                        {...register("shippingFirstName", { required: "Required" })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.shippingFirstName ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <input
                        type="text"
                        placeholder="Last name"
                        {...register("shippingLastName", { required: "Required" })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.shippingLastName ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        {...register("shippingAddress", { required: "Required" })}
                        className={`col-span-2 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.shippingAddress ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <input
                        type="text"
                        placeholder="Apartment, suite, etc."
                        {...register("shippingAddress2")}
                        className="col-span-2 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        {...register("shippingCity", { required: "Required" })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.shippingCity ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <select
                        {...register("shippingState", { required: "Required" })}
                        aria-label="State"
                        className={`border rounded-lg p-3 appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.shippingState ? "border-red-500" : "border-gray-300"
                        }`}
                        defaultValue=""
                    >
                        <option value="" disabled>
                        Select State / Union Territory
                        </option>
                        {INDIAN_STATES_AND_UTS.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="PIN Code"
                        {...register("shippingPin", {
                        required: "Required",
                        pattern: {
                            value: /^\d{6}$/,
                            message: "Must be a 6-digit PIN code",
                        },
                        })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.shippingPin ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <input
                        type="text"
                        placeholder="Phone (optional)"
                        {...register("shippingPhone")}
                        className="col-span-2 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    </div>
                    <div className="mt-6">
                    <label className="inline-flex items-center text-gray-700 cursor-pointer">
                        <input
                        type="checkbox"
                        {...register("sameAddress")}
                        className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-base select-none">Use same address for billing</span>
                    </label>
                    </div>
                </section>

                {/* Billing Address - conditional */}
                {!sameAddress && (
                    <section className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-5 text-gray-800">Billing Address</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <select
                        {...register("billingCountry")}
                        aria-label="Billing Country"
                        className="col-span-2 border border-gray-300 rounded-lg p-3 appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        defaultValue="India"
                        >
                        <option value="India">India</option>
                        </select>
                        <input
                        type="text"
                        placeholder="First name"
                        {...register("billingFirstName", { required: "Required" })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                            errors.billingFirstName ? "border-red-500" : "border-gray-300"
                        }`}
                        />
                        <input
                        type="text"
                        placeholder="Last name"
                        {...register("billingLastName", { required: "Required" })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                            errors.billingLastName ? "border-red-500" : "border-gray-300"
                        }`}
                        />
                        <input
                        type="text"
                        placeholder="Address"
                        {...register("billingAddress", { required: "Required" })}
                        className={`col-span-2 border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                            errors.billingAddress ? "border-red-500" : "border-gray-300"
                        }`}
                        />
                        <input
                        type="text"
                        placeholder="Apartment, suite, etc."
                        {...register("billingAddress2")}
                        className="col-span-2 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <input
                        type="text"
                        placeholder="City"
                        {...register("billingCity", { required: "Required" })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                            errors.billingCity ? "border-red-500" : "border-gray-300"
                        }`}
                        />
                        <select
                        {...register("billingState", { required: "Required" })}
                        aria-label="Billing State"
                        className={`border rounded-lg p-3 appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                            errors.billingState ? "border-red-500" : "border-gray-300"
                        }`}
                        defaultValue=""
                        >
                        <option value="" disabled>
                            Select State / Union Territory
                        </option>
                        {INDIAN_STATES_AND_UTS.map((state) => (
                            <option key={state} value={state}>
                            {state}
                            </option>
                        ))}
                        </select>
                        <input
                        type="text"
                        placeholder="PIN Code"
                        {...register("billingPin", {
                            required: "Required",
                            pattern: {
                            value: /^\d{6}$/,
                            message: "Must be a 6-digit PIN code",
                            },
                        })}
                        className={`border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                            errors.billingPin ? "border-red-500" : "border-gray-300"
                        }`}
                        />
                        <input
                        type="text"
                        placeholder="Phone (optional)"
                        {...register("billingPhone")}
                        className="col-span-2 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    </section>
                )}
                </section>

                {/* Order Summary Section */}
                <div className="bg-white rounded-xl p-8 shadow-md flex flex-col sticky top-8 h-fit">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>

                <div className="space-y-4 flex-grow overflow-y-auto max-h-[350px]">
                    {products.length === 0 ? (
                    <p className="text-gray-500 text-center">No products in order summary.</p>
                    ) : (
                    products.map((item) => (
                        <div
                        key={item.id}
                        className="flex items-center border-b border-gray-200 pb-3 gap-4"
                        >
                        {/* Product image thumbnail */}
                        <img
                            src={
                            item.image ||
                            (item.imageUrls && item.imageUrls[0]) ||
                            "/placeholder.png"
                            }
                            alt={item.name}
                            className="w-14 h-14 object-contain rounded border border-gray-200 flex-shrink-0"
                        />
                        {/* Product details */}
                        <div className="flex-1 min-w-0">
                            <Link
                            to={`/product/${item.id}`}
                            className="font-semibold text-gray-800 text-sm line-clamp-2 break-words"
                            >
                            {item.name}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900 ml-4">
                            ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                        </div>
                    ))
                    )}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-300 pt-6 space-y-3 text-gray-700 text-sm">
                    <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between bg-yellow-50 px-2 py-1 rounded">
                    <span>Delivery</span>
                    <span>₹{DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between bg-yellow-50 px-2 py-1 rounded">
                    <span>GST 12%</span>
                    <span>₹{gst}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-3 font-semibold text-base">
                    <span>Total</span>
                    <span>₹{total}</span>
                    </div>
                </div>
                </div>
            </div>

            <div className="mb-6 mt-6 flex justify-between items-center bg-white p-6 rounded-xl shadow-md">
                <button
                onClick={() => window.history.back()}
                className="text-indigo-600 font-semibold hover:underline focus:outline-none"
                >
                &larr; Return to Cart
                </button>
                <button
                type="submit"
                onClick={() => makePayment(orderDocId)}
                disabled={!isValid}
                className={`bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                ${!isValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                >
                Pay ₹{total}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}
