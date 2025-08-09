import Hero from './pages/comps/Hero/Hero'
import FashionSection from './pages/comps/Hero/FashionSection'
import PopularProducts from './pages/comps/ProductsSection/PopularProducts'
import Blogs from './pages/comps/Blogs/Blogs'
import RecentProducts from './pages/comps/ProductsSection/RecentProducts'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Hero/>
      <FashionSection/>
      <PopularProducts/>
      <Blogs/>
      <RecentProducts/>
    </>
  )
}

export default App
