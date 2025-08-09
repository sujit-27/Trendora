import Image1 from "../assets/slider/zip-j.png"
import Image2 from "../assets/slider/reds.png"
import Image3 from "../assets/slider/watch.png"
import Image4 from "../assets/slider/denim.png"
import categorylogo1 from "../assets/Electronics/Category-logo.png"
import FashionLogo from "../assets/Fashion/FashionLogo.png"
import BeautyLogo from "../assets/Health/BeautyLogo.png"
import HomeLogo from "../assets/Home/HomeLogo.png"
import MobileLogo from "../assets/Electronics/Mobile-Logo.png"
import JewelLogo from "../assets/Fashion/JewelLogo.webp"
import AllLogo from "../assets/cart/AllLogo.png"
import {
  Truck,
  RotateCcw,
  Wallet,
  Headphones,
  CreditCard,
} from 'lucide-react';

export const DropdownLinks = [
    {
        id: 1,
        name: "Trending Products",
        link: "/",
    },
    {
        id: 2,
        name: "Best Selling",
        link: "/",
    },
    {
        id: 3,
        name: "Top Rated",
        link: "/",
    },
    {
        id: 4,
        name: "Highly Recommended",
        link: "/",
    },
    {
        id: 5,
        name: "New Launches",
        link: "/",
    },
]

export const DropdownUsers = [
    {
        id:1,
        name: "Login",
        link: "/login"
    },
    {
        id:2,
        name: "Sign Up",
        link: "/signup"
    }
]

export const HeroCategoryData = [
    {
        id:1,
        name: "Electronics",
        link: "/electronics",
    },
    {
        id:2,
        name: "Fashion",
        link: "/fashion",
    },
    {
        id:3,
        name: "Beauty & Health",
        link: "/beauty",
    },
    {
        id:4,
        name: "Home & Living",
        link: "/home",
    },
    {
        id:5,
        name: "Mobile & Accessories",
        link: "/mobileandaccessories",
    },
    {
        id:6,
        name: "Jewelery & Accessories",
        link: "/jewelleryandaccessories",
    },
]

export const HeroCategoryMobileData = [
    {
        id:0,
        name: "All",
        image: AllLogo,
        link: "/shop",
    },
    {
        id:1,
        name: "Electronics",
        image: categorylogo1,
        link: "/electronics",
    },
    {
        id:2,
        name: "Fashion",
        image: FashionLogo,
        link: "/fashion",
    },
    {
        id:3,
        name: "Beauty & Health",
        image: BeautyLogo,
        link: "/beauty",
    },
    {
        id:4,
        name: "Home & Living",
        image: HomeLogo,
        link: "/home",
    },
    {
        id:5,
        name: "Gadgets",
        image: MobileLogo,
        link: "/mobileandaccessories",
    },
    {
        id:6,
        name: "Adornments",
        image: JewelLogo,
        link: "/jewelleryandaccessories",
    },
]

export const HeroSliderData = [
  {
    id: 1,
    image: Image1,
    subtitle: "Best Sales",
    title: "Zip Jackets",
    bg_title: "ZIP JACKET",
    description: "Get cozy and stylish with our premium zip jackets.",
    bgColor: "bg-[#fef9f1]",
    textColor: "text-gray-900",
    circleColor: "bg-yellow-100",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
    highlightColor: "text-indigo-600",
    link: "/fashion?category=women",
  },
  {
    id: 2,
    image: Image2 ,
    subtitle: "Limited Offer",
    title: "Red Sneakers",
    bg_title: "SNEAKERS",
    description: "Bold red kicks that match your energy and speed.",
    bgColor: "bg-[#fff0f0]",
    textColor: "text-red-800",
    circleColor: "bg-red-200",
    buttonColor: "bg-red-500 hover:bg-red-600",
    highlightColor: "text-white",
    link: "/fashion?category=shoes"
  },
  {
    id: 3,
    image: Image3,
    subtitle: "New Arrival",
    title: "Smart Watch",
    bg_title: "WATCH",
    description: "Elegant design, powerful features. Time to upgrade.",
    bgColor: "bg-[#f0f5ff]",
    textColor: "text-blue-800",
    circleColor: "bg-blue-200",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    highlightColor: "text-black",
    link: "/electronics?category=watch",
  },
  {
    id: 4,
    image: Image4,
    subtitle: "Trending Now",
    title: "Denim Shirt",
    bg_title: "DENIM",
    description: "Classic style never fades. Rock the denim wave.",
    bgColor: "bg-[#f0fff4]",
    textColor: "text-green-900",
    circleColor: "bg-green-200",
    buttonColor: "bg-green-500 hover:bg-green-600",
    highlightColor: "text-black",
    link: "fashion?category=men",
  },
];


export const HeroFeatures = [
  {
    id: 1, 
    icon: Truck,
    title: 'FREE DELIVERY',
    subtitle: 'From $59.59',
  },
  {
    id: 2,
    icon: RotateCcw,
    title: 'FREE RETURN',
    subtitle: '365 A days',
  },
  {
    id: 3,
    icon: Wallet,
    title: 'BIG SAVING',
    subtitle: 'From $29.59',
  },
  {
    id: 4,
    icon: Headphones,
    title: 'SUPPORT 24/7',
    subtitle: 'Online 24 hours',
  },
  {
    id: 5,
    icon: CreditCard,
    title: 'PAYMENT METHOD',
    subtitle: 'Secure payment',
  },
];