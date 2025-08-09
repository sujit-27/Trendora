import React, { useEffect, useState } from "react";
import authService from "@/lib/appwrite/auth";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const currentUser = await authService.account.get();
        if (!cancelled) {
          if (currentUser) {
            setUser(currentUser);
            setError(null);
          } else {
            setUser(null);
            setError("User not logged in.");
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load profile.");
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="ml-8 text-gray-600 p-6 ">Loading profile...</div>
    );
  }

  if (error) {
    return (
      <div className="ml-8 text-red-500 p-6">{error}</div>
    );
  }

  if (!user) {
    return (
      <div className="ml-8 text-gray-600 p-6">No user data found.</div>
    );
  }

  return (
    <div className="sm:ml-10  max-w-md rounded-[5px] p-5  ">
      <h2 className="text-2xl font-bold text-gray-900/90 mb-8">
        My Profile
      </h2>

      {/* User ID */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-black">
          User ID:
        </label>
        <input
          type="text"
          value={user.$id}
          readOnly
          className="w-full px-4 py-1.5 border rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
        />
      </div>

      {/* Name */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-black">
          Name:
        </label>
        <input
          type="text"
          value={user.name || "N/A"}
          readOnly
          className="w-full px-4 py-1.5 border rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-black">
          Email:
        </label>
        <input
          type="email"
          value={user.email || "N/A"}
          readOnly
          className="w-full px-4 py-1.5 border rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
