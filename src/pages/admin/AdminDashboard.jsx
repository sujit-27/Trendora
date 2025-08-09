import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Pencil,
  PackageSearch,
  LogOut,
} from 'lucide-react';
import { FaKey, FaShoppingBasket, FaBars, FaTimes } from 'react-icons/fa';
import authService from '@/lib/appwrite/auth';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when link clicked on mobile
  const onLinkClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      <main>
        <div className='w-full mx-auto'>
          <div className='p-15 text-center bg-gradient-to-r from-rose-300 via-rose-100 to-rose-300'>
            <h1 className='text-4xl font-bold text-black/80'>Admin account</h1>
            <p className='text-sm font-semibold mt-4 text-gray-500'>Home/My account</p>
          </div>
        </div>

        {/* Container: flex-col on mobile, flex-row on desktop */}
        <div className='max-w-8xl mx-auto m-4 flex flex-col sm:flex-row'>

          {/* Mobile Hamburger - visible only on small screens */}
          <div className="sm:hidden flex justify-between items-center px-4 py-3 border-b border-gray-300">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              className="text-2xl"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Sidebar - slides in from left */}
          <aside
            className={`
              fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-300 shadow-lg p-6
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              sm:hidden
            `}
          >
            <ul className='space-y-7'>
              <li>
                <Link
                  to="/admin/dashboard"
                  onClick={onLinkClick}
                  className="w-full block px-3 py-1.5 rounded-lg transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <Home size={18} />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="add-product"
                  onClick={onLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <PlusCircle size={18} />
                    <span>Add Product</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="add-blog"
                  onClick={onLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <Pencil size={18} />
                    <span>Add Blog</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="my-products"
                  onClick={onLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <PackageSearch size={18} />
                    <span>View Products</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="orders"
                  onClick={onLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <FaShoppingBasket size={18} className='opacity-90' />
                    <span>Orders</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="manage-credentials"
                  onClick={onLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <FaKey size={18} className='opacity-90' />
                    <span>Manage Credentials</span>
                  </div>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    onLinkClick();
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer flex items-center gap-8"
                >
                  <LogOut size={18} className='ml-1' />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              onClick={toggleSidebar}
              aria-hidden="true"
              className="fixed inset-0 z-40 sm:hidden"
            />
          )}

          {/* Desktop Sidebar - visible on sm and up, unchanged */}
          <aside className="hidden sm:block w-70 border-r-2 border-gray-300 ml-10 pr-10 mt-5">
            <ul className='space-y-7'>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="w-full block px-3 py-1.5 rounded-lg transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <Home size={18} />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="add-product"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <PlusCircle size={18} />
                    <span>Add Product</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="add-blog"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <Pencil size={18} />
                    <span>Add Blog</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="my-products"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <PackageSearch size={18} />
                    <span>View Products</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="orders"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <FaShoppingBasket size={18} className='opacity-90' />
                    <span>Orders</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="manage-credentials"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className='flex flex-row items-center gap-8'>
                    <FaKey size={18} className='opacity-90' />
                    <span>Manage Credentials</span>
                  </div>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                  type="button"
                >
                  <div className="flex flex-row items-center gap-8">
                    <LogOut size={18} className="ml-1" />
                    <span>Logout</span>
                  </div>
                </button>
              </li>
            </ul>
          </aside>

          {/* Main content area */}
          <main className="flex-1 mt-5">
            <Outlet />
          </main>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
