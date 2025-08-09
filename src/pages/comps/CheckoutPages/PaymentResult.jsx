import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import service from "@/lib/appwrite/service"; 

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    paymentId,
    orderId,
    payerName,
    payerEmail,
    payerPhone,
    amount,
  } = location.state || {};

  const [updating, setUpdating] = useState(true);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }

    async function updateOrderStatus() {
      setUpdating(true);
      try {
        await service.updateOrder(orderId, {
          status: "successful",
          paymentStatus: "paid",
        });
        setUpdateError(null);
      } catch (error) {
        console.error("Failed to update order:", error);
        setUpdateError("Failed to update order status. Please contact support.");
      } finally {
        setUpdating(false);
      }
    }

    updateOrderStatus();
  }, [orderId, paymentId, payerName, payerEmail, payerPhone, amount]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="bg-white p-10 rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-6 text-green-600">Payment Successful!</h1>
        {updating ? (
          <p className="mb-6 text-gray-600">Updating order status...</p>
        ) : updateError ? (
          <p className="mb-6 text-red-600">{updateError}</p>
        ) : (
          <>
            <p className="mb-4 text-gray-700">
              Thank you for your purchase, <strong>{payerName}</strong>.
            </p>
            <p className="mb-2">
              <span className="font-semibold">Payment ID:</span> {paymentId}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Order ID:</span> {orderId}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {payerEmail}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Phone:</span> {payerPhone}
            </p>
            <p className="mb-6 text-lg font-semibold">
              Amount Paid: ₹{amount.toFixed(2)}
            </p>
          </>
        )}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
