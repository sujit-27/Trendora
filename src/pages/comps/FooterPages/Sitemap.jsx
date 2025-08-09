import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => (
  <div className="max-w-5xl mx-auto mt-3 p-8 bg-white rounded-lg shadow-lg">
    <h1 className="text-5xl font-extrabold text-rose-600 mb-12 text-center drop-shadow-lg">
      Sitemap
    </h1>

    <nav aria-label="Sitemap Navigation" className="space-y-10 text-lg">
      {/* Top Level Pages */}
      <section>
        <h2 className="text-3xl font-semibold border-b-4 border-rose-600 inline-block mb-6">
          Main Pages
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <li>
            <Link to="/" className="hover:text-rose-400 transition duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-rose-400 transition duration-200">
              Shop
            </Link>
          </li>
          <li>
            <a href="/#blogs" className="hover:text-rose-400 transition duration-200">
              Blogs
            </a>
          </li>
          <li>
            <Link to="/about" className="hover:text-rose-400 transition duration-200">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-rose-400 transition duration-200">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-rose-400 transition duration-200">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-rose-400 transition duration-200">
              Terms & Conditions
            </Link>
          </li>
        </ul>
      </section>

      {/* User Account Pages */}
      <section>
        <h2 className="text-3xl font-semibold border-b-4 border-rose-600 inline-block mb-6">
          User Account Pages
        </h2>
        <ul className="space-y-4">
          <li>
            <Link to="/login" className="hover:text-rose-400 transition duration-200">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="hover:text-rose-400 transition duration-200">
              Signup
            </Link>
          </li>
          <li>
            <details className="bg-gray-100 p-4 rounded-lg group">
              <summary className="cursor-pointer font-semibold text-rose-600 group-open:underline transition">
                User Dashboard
              </summary>
              <ul className="mt-3 ml-5 space-y-2 text-gray-700">
                <li>
                  <Link to="/user/dashboard/myorders" className="hover:text-rose-400 transition duration-200">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/user/dashboard/profile" className="hover:text-rose-400 transition duration-200">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/user/dashboard/managecredentials" className="hover:text-rose-400 transition duration-200">
                    Manage Credentials
                  </Link>
                </li>
                <li>
                  <Link to="/user/dashboard/support" className="hover:text-rose-400 transition duration-200">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/user/dashboard/wishlist" className="hover:text-rose-400 transition duration-200">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </section>

      {/* Admin Dashboard */}
      <section>
        <h2 className="text-3xl font-semibold border-b-4 border-rose-600 inline-block mb-6">
          Admin Dashboard
        </h2>
        <ul className="space-y-4">
          <li>
            <Link to="/admin/dashboard" className="hover:text-rose-400 transition duration-200">
              Dashboard Home
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/add-product" className="hover:text-rose-400 transition duration-200">
              Add Product
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/add-blog" className="hover:text-rose-400 transition duration-200">
              Add Blog
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/my-products" className="hover:text-rose-400 transition duration-200">
              My Products
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/orders" className="hover:text-rose-400 transition duration-200">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/dashboard/manage-credentials" className="hover:text-rose-400 transition duration-200">
              Manage Credentials
            </Link>
          </li>
        </ul>
      </section>

      {/* Cart and Checkout */}
      <section>
        <h2 className="text-3xl font-semibold border-b-4 border-rose-600 inline-block mb-6">
          Shopping
        </h2>
        <ul className="space-y-4">
          <li>
            <Link to="/cart" className="hover:text-rose-400 transition duration-200">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/checkout" className="hover:text-rose-400 transition duration-200">
              Checkout
            </Link>
          </li>
        </ul>
      </section>
    </nav>
  </div>
);

export default Sitemap;
