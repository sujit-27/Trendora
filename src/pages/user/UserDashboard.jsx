import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  User,
  Lock,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { FaBars, FaTimes } from "react-icons/fa";
import authService from '@/lib/appwrite/auth';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLinkClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      <main>
        <div className="w-full mx-auto">
          <div className="p-15 text-center bg-gradient-to-r from-rose-300 via-rose-100 to-rose-300">
            <h1 className="text-4xl font-bold text-black/80">My Account</h1>
            <p className="text-sm font-semibold mt-4 text-gray-500">Home / My Account</p>
          </div>
        </div>

        {/* Container with flex changing from column on mobile to row on desktop */}
        <div className="max-w-8xl mx-auto m-4 flex flex-col sm:flex-row">

          {/* Mobile Hamburger*/}
          <div className="sm:hidden flex justify-between items-center p-4 border-b border-gray-300">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar menu"
              className="text-2xl"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Sidebar*/}
          <aside
            className={`fixed top-0 left-0 h-full bg-gray-200 border-r border-gray-300 w-64 z-50 shadow-lg p-6
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              sm:hidden
            `}
          >
            <ul className="space-y-7">
              <li>
                <Link
                  to="/user/dashboard"
                  onClick={handleLinkClick}
                  className="w-full block px-3 py-1.5 rounded-lg transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <Home size={18} />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="myorders"
                  onClick={handleLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <ShoppingCart size={18} />
                    <span>My Orders</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="profile"
                  onClick={handleLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <User size={18} />
                    <span>My Profile</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="managecredentials"
                  onClick={handleLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <Lock size={18} />
                    <span>Manage Credentials</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="support"
                  onClick={handleLinkClick}
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <LifeBuoy size={18} />
                    <span>Support</span>
                  </div>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLinkClick();
                    handleLogout();
                  }}
                  className="w-full block text-left px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
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

          {/* Overlay behind sidebar on mobile */}
          {sidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black opacity-30 z-40 sm:hidden"
              aria-hidden="true"
            />
          )}

          {/* Desktop Sidebar*/}
          <aside className="hidden sm:block w-70 border-r-2 border-gray-300 pr-10 mt-7 ml-12">
            <ul className="space-y-7">
              <li>
                <Link
                  to="/user/dashboard"
                  className="w-full block px-3 py-1.5 rounded-lg transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <Home size={18} />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="myorders"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <ShoppingCart size={18} />
                    <span>My Orders</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="profile"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <User size={18} />
                    <span>My Profile</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="managecredentials"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <Lock size={18} />
                    <span>Manage Credentials</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="support"
                  className="w-full block px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <div className="flex flex-row items-center gap-8">
                    <LifeBuoy size={18} />
                    <span>Support</span>
                  </div>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full block text-left px-3 py-1.5 rounded-md transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600 font-medium cursor-pointer"
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
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;
