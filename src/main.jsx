import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Login from './pages/auth/Login'
import Signup from './pages/auth/SignUp'
import Layout from './Layout/Layout'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard'
import AddProduct from './pages/admin/AddProduct'
import MyProducts from './pages/admin/MyProducts'
import UpdateProduct from './pages/admin/UpdateProduct'
import ManageCredentials from './pages/admin/ManageCredentials'
import DashboardHome from './pages/admin/DashboardHome'
import AddBlog from './pages/admin/AddBlog'
import Shop from './pages/comps/Shop/Shop'
import Fashion from './pages/comps/Shop/Fashion'
import Electronics from './pages/comps/Shop/Electronics'
import CartPage from './pages/comps/NavSection/CartPage'
import WishlistPage from './pages/comps/NavSection/WishlistPage'
import BeautyAndHealth from './pages/comps/Shop/BeautyAndHealth'
import HomeAndLiving from './pages/comps/Shop/HomeAndLiving'
import MobileAndAccessories from './pages/comps/Shop/MobileAndAccessories'
import JewelleryAndAccessories from './pages/comps/Shop/JewelleryAndAccessories'
import ProductDetailsPage from './pages/comps/ProductsDetails/ProductDetailPage'
import CheckoutPage from './pages/comps/CheckoutPages/CheckoutPage'
import ProceedCheckoutPage from './pages/comps/CheckoutPages/ProceedCheckoutPage'
import PaymentResult from './pages/comps/CheckoutPages/PaymentResult'
import Orders from './pages/admin/Orders'
import UserDashboardHome from './pages/user/UserDashboardHome'
import ManageCredential from './pages/user/ManageCredential'
import Support from './pages/user/Support'
import MyOrders from './pages/user/MyOrders'
import MyProfile from './pages/user/MyProfile'
import DetailBlogCard from './pages/comps/Blogs/DetailBlogCard'
import ContactUs from './pages/comps/FooterPages/ContactUs'
import AboutUs from './pages/comps/FooterPages/AboutUs'
import Sitemap from './pages/comps/FooterPages/Sitemap'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
        <Route path='/' element={<Layout/>}>
          <Route index element={<App/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/fashion' element={<Fashion/>}/>
          <Route path='/electronics' element={<Electronics/>}/> 
          <Route path='/beauty' element={<BeautyAndHealth/>}/>
          <Route path='/home' element={<HomeAndLiving/>}/>
          <Route path='/mobileandaccessories' element={<MobileAndAccessories/>}/>
          <Route path='/jewelleryandaccessories' element={<JewelleryAndAccessories/>}/>
          <Route path='/detailblogcard' element={<DetailBlogCard/>}/>
          <Route path='/cart' element={<CartPage/>}/>
          <Route path='/wishlist' element={<WishlistPage/>}/>
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/proceedcheckout" element={<ProceedCheckoutPage/>}/>
          <Route path="/paymentresult" element={<PaymentResult/>}/>
          <Route path='/contact-us' element={<ContactUs/>}/>
          <Route path='/about-us' element={<AboutUs/>}/>
          <Route path='/sitemap' element={<Sitemap/>}/> 
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="my-products" element={<MyProducts />} />
            <Route path="my-products/update-product/:id" element={<UpdateProduct />} />
            <Route path="add-blog" element={<AddBlog/>}/>
            <Route path='orders' element={<Orders/>}/>
            <Route path="manage-credentials" element={<ManageCredentials />} />
          </Route>
          <Route path='/user/dashboard' element={<UserDashboard/>}>
            <Route index element={<UserDashboardHome />} />
            <Route path='managecredentials' element={<ManageCredential/>}/>
            <Route path='support' element={<Support/>}/>
            <Route path='myorders' element={<MyOrders/>}/>
            <Route path='profile' element={<MyProfile/>}/>
          </Route>
        </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
