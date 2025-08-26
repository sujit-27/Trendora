import authService from '@/lib/appwrite/auth';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {

  const {role , setRole} = useState(null);
  const navigate = useNavigate();

  const handleMyAccountClick = async () => {
    const r = await authService.getUserRole();
    setRole(r);
      if (role === "admin") {
      navigate("/admin/dashboard/manage-credentials");
      } else {
      navigate("/user/dashboard/profile'");
      }
  }

  const handleMyordersClick = () => {
      if (role === "admin") {
      navigate("/admin/dashboard/orders");
      } else {
      navigate("/user/dashboard/myorders");
      }
  }

  const handlePasswordClick = () => {
    if (role === "admin") {
      navigate("/admin/dashboard/manage-credentials");
      } else {
      navigate("/user/dashboard/managecredentials");
      }
  }

  return (
    <footer className="bg-gradient-to-r from-rose-300/90 via-rose-100 to-rose-300/90 text-gray-700 px-6 py-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand Description */}
        <div>
          <h2 className="text-3xl text-black mb-4 font-bold">Trendora</h2>
          <p className="text-gray-600 leading-relaxed max-w-xs">
            Trendora is more than just a store — it's a curated marketplace designed to deliver
            quality, value, and style. Enjoy a smooth and secure shopping experience with fast
            delivery, easy returns, and products you'll love.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Shop</h3>
          <ul className="space-y-2">
            <li><Link to={"/shop"} className="hover:underline">My Shop</Link></li>
            <li><Link to={"/sitemap"} className="hover:underline">Sitemap</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to={"/about-us"} className="hover:underline">About Us</Link></li>
            <li><Link to={"/contact-us"} className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">My Account</h3>
          <ul className="space-y-2">
            <li><a onClick={handleMyAccountClick} className="cursor-pointer hover:underline">My Account</a></li>
            <li><a onClick={handleMyordersClick} className="hover:underline cursor-pointer">My Orders</a></li>
            <li><a onClick={handlePasswordClick} className="hover:underline">Lost Password</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Trendora. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
