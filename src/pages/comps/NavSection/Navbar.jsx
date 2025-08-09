import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { IoMdHeartEmpty, IoMdSearch } from 'react-icons/io';
import { SlUser } from 'react-icons/sl';
import {FaShoppingCart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import authService from '@/lib/appwrite/auth';
import service from '@/lib/appwrite/service';
import { MdPersonAdd } from 'react-icons/md';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();


    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const searchVisibleRoutes = ['/'];
    const isSearchVisible = searchVisibleRoutes.includes(location.pathname);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const allProducts = await service.getAllProducts();
            setProducts(allProducts);
            const cats = allProducts.map(p => p.category).filter(Boolean);
            setCategories([...new Set(cats.map(c => c.toLowerCase()))]);
        } catch (err) {
            console.error("Search products fetch failed:", err);
        }
        };
        fetchProducts();
    }, []);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        setUser(null);
        navigate("/login");
    };

    const handleDashboardClick = async () => {
        const role = await authService.getUserRole();
        if (role === "admin") {
        navigate("/admin/dashboard");
        } else {
        navigate("/user/dashboard");
        }
    };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    // Check for category match
    const matchedCategory = categories.find(cat => cat.includes(term))?.split('-')[0];
    if (matchedCategory) {
      navigate(`/${encodeURIComponent(matchedCategory)}`);
      return;
    }

    // Check for product title match
    const matchedProduct = products.find(
      (p) => p.Title?.toLowerCase().includes(term)
    );
    if (matchedProduct && matchedProduct.category) {
      const category = matchedProduct.category.toLowerCase();
      navigate(`/${category}?category=${encodeURIComponent(category)}`);
      return;
    }

    console.error('No results found.');
  };

    return (
        <div className={`bg-white sm:bg-gray-300/50 text-black border-b border-gray-200 shadow-md relative z-40`}
        >
            <div className='py-3 max-w-7xl mx-auto'>
                {/* Main container: flex-col on mobile to stack search below logo, flex-row on sm+ */}
                <div className='flex flex-col'>
                    <div className="flex flex-row justify-between items-center gap-3 px-4">
                        {/* Logo and Links Section */}
                        <div className='flex items-center gap-10'>
                            <Link
                            className="flex items-center font-bold tracking-widest uppercase text-2xl sm:text-3xl"
                            to="/"
                            >
                            {/* Desktop Text + Icon */}
                            <span className="flex items-center ml-1">
                                Trend<span className="text-rose-600"><ShoppingBag size={28} /></span>ra
                            </span>
                            </Link>

                            {/* Desktop nav links - unchanged, hidden on mobile */}
                            <nav className='hidden lg:block'>
                            <ul className='flex gap-3 font-semibold'>
                                <Link
                                to="/"
                                className={`inline-block px-5 text-gray-600 hover:text-rose-500 duration-200`}
                                >
                                Home
                                </Link>
                                <Link
                                to="/shop"
                                className={`inline-block px-5 text-gray-600 hover:text-rose-500 duration-200`}
                                >
                                Shop
                                </Link>
                                <Link
                                href="/"
                                onClick={() => {
                                    const section = document.getElementById("blogs");
                                    section?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className={`inline-block px-5 text-gray-600 hover:text-rose-500 duration-200`}
                                >
                                Blogs
                                </Link>
                                <Link
                                to="/contact-us"
                                className={`inline-block px-5 text-gray-600 hover:text-rose-500 duration-200`}
                                >
                                Contact-Us
                                </Link>

                            </ul>
                            </nav>
                        </div>

                        {/* Search bar and action buttons section */}
                        <div className="flex flex-row justify-between items-center gap-3 w-auto">

                            {/* DESKTOP SEARCH BAR*/}
                            <div className="relative hidden group sm:block w-max">
                            <div className="flex items-center group-hover:border-gray-300 transition-all duration-300 ease-in-out border border-transparent rounded-md px-2">
                                <form onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className={`
                                    w-40 opacity-100
                                    group-hover:w-40 group-hover:opacity-100
                                    sm:w-0 sm:opacity-0
                                    sm:group-hover:w-60 sm:group-hover:opacity-100
                                    sm:focus:w-60 focus:w-40
                                    pl-3 pr-10 py-2 transition-all duration-300 ease-in-out
                                    text-gray-800 text-sm placeholder:text-gray-500 focus:outline-none border-none
                                    `}
                                />
                                <button type="submit">
                                    <IoMdSearch
                                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl cursor-pointer`}
                                    />
                                </button>
                                </form>
                            </div>
                            </div>

                            {/* Other buttons: Wishlist, User, Cart */}
                            <div className="flex gap-3 mt-0 items-center">

                            <Button
                                variant="ghost"
                                className="hover:text-red-600 w-[25px] h-[25px]"
                                onClick={() => navigate("/wishlist")}
                            >
                                <IoMdHeartEmpty size={20} />
                            </Button>

                            {/* User Icon Dropdown */}
                            <ul>
                                <li className="group relative cursor-pointer"
                                    ref={menuRef}
                                >
                                <Button 
                                    variant="ghost" 
                                    className={`rounded-4xl bg-zinc-300`}
                                    onClick={() => setIsOpen(!isOpen)}
                                    aria-expanded={isOpen}
                                    aria-haspopup="true"
                                >
                                    <SlUser />
                                </Button>
                                <div
                                    className={`absolute z-[9999] w-48 rounded-xl shadow-lg text-sm p-3 backdrop-blur-md transition-all duration-300
                                        bg-white/90 text-gray-700 border border-gray-200
                                        ${isOpen ? 'block' : 'hidden'} group-hover:block`}
                                    >
                                    <ul className="space-y-2">
                                        {user ? (
                                        <>
                                            <li>
                                            <button
                                                onClick={() => {
                                                handleDashboardClick();
                                                setIsOpen(false);
                                                }}
                                                className={`w-full text-left block px-3 py-1.5 rounded-md transition-colors duration-200
                                                hover:bg-rose-100 hover:text-rose-600 cursor-pointer`}
                                            >
                                                Dashboard
                                            </button>
                                            </li>
                                            <li>
                                            <button
                                                onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                                }}
                                                className={`w-full text-left block px-3 py-1.5 rounded-md transition-colors duration-200
                                                hover:bg-rose-100 hover:text-rose-600`}
                                            >
                                                Logout
                                            </button>
                                            </li>
                                        </>
                                        ) : (
                                        <>
                                            <li>
                                            <Link
                                                to="/login"
                                                className={`block px-3 py-1.5 rounded-md transition-colors duration-200
                                                hover:bg-rose-100 hover:text-rose-600`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Login
                                            </Link>
                                            </li>
                                            <li>
                                            <Link
                                                to="/signup"
                                                className={`block px-3 py-1.5 rounded-md transition-colors duration-200
                                                hover:bg-rose-100 hover:text-rose-600`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Signup
                                            </Link>
                                            </li>
                                        </>
                                        )}
                                    </ul>
                                </div>
                                </li>
                            </ul>

                            {/* Cart Button */}
                            <Button
                                variant="outline"
                                className={`hover:bg-rose-500/80 text-black`}
                                onClick={() => navigate("/cart")}
                            >
                                <FaShoppingCart />
                            </Button>

                            </div>
                        </div>
                    </div>
                    {isSearchVisible && (
                        <>
                            <div className='sm:hidden'>
                                <Link
                                    to="/signup"
                                >
                                <div className='flex flex-row gap-2 mt-3 ml-2 items-center'>
                                    <div>
                                        <MdPersonAdd size={21}/>
                                    </div>
                                    <h1 className='text-sm text-gray-600'><span className='text-rose-400 font-semibold'>Register</span> as an Admin to Sell Products</h1>
                                </div>
                                </Link>
                            </div>
                            <div className='flex flex-row items-center'>
                                <div className="relative w-full sm:hidden mt-4 px-4">
                                    <form onSubmit={handleSearchSubmit} className="w-full">
                                        <input
                                        type="text"
                                        placeholder="Search for Products"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className={`
                                            w-full pl-5 pr-10 py-3 rounded-md border border-transparent
                                            text-gray-800 outline-2
                                            placeholder:text-gray-500 focus:outline-none  transition
                                            text-sm
                                        `}
                                        />
                                        <button
                                        type="submit"
                                        className="absolute right-8 top-1/2 transform -translate-y-1/2"
                                        >
                                        <IoMdSearch className={`text-gray-600 text-xl cursor-pointer`} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
