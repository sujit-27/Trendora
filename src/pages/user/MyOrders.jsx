import React, { useEffect, useState } from "react";
import service from "@/lib/appwrite/service"; // adjust path
import authService from "@/lib/appwrite/auth";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUserOrders() {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        if (!user) {
          if (!cancelled) {
            setOrders([]);
            setLoading(false);
          }
          return;
        }

        const fetchedOrders = await service.fetchOrders();
        if (!cancelled) {
          setOrders(fetchedOrders || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to fetch your orders.");
          setLoading(false);
        }
      }
    }

    loadUserOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6 text-gray-600">Loading your orders...</div>
    );
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-6 text-gray-600">You have no orders yet.</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-5">My Orders</h1>
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">Order ID</th>
            <th className="border p-3 text-left">Products</th>
            <th className="border p-3 text-left">Status</th>
            <th className="border p-3 text-left">Total Amount (₹)</th>
            <th className="border p-3 text-left">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const productList = Array.isArray(order.products)
              ? order.products.map((product) => product.name).join(", ")
              : "N/A";

            return (
              <tr key={order.$id || order.id}>
                <td className="border p-3">{order.$id || order.id}</td>
                <td className="border p-3">{productList}</td>
                <td className="border p-3">{order.status || "Pending"}</td>
                <td className="border p-3">
                  {Number(order.totalAmount).toFixed(2) || "0.00"}
                </td>
                <td className="border p-3">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString()
                    : order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
