import service from '@/lib/appwrite/service'
import React, { useEffect, useState } from 'react'
import ProductGrid from './ProductGrid';

const PopularProducts = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsAndImages = async () => {
      const data = await service.getAllProducts();

      const filtered = data.filter((product) =>
        product.category?.toLowerCase().includes("fashion")
      );

      setProducts(filtered);
    };

    fetchProductsAndImages();
  }, []);

  return (
    <>
      <section className='mt-10'>
        <div className='max-w-7xl mx-auto'>
          <div>
            <div className='text-center uppercase font-semibold text-rose-400'>Popular Products</div>
          </div>
          <div className='mt-5'>
            <div 
              style={{
                        fontFamily: '"Style Script", cursive',
                        fontWeight: 900,
                        fontStyle: 'normal'
                    }} 
              className='font-black text-4xl font-script text-center'>Our Best Products</div>
          </div>
          <div className="flex items-center space-x-2 justify-center mt-3">
            <div className="flex space-x-1">
              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
            </div>
            <div className="flex h-1 w-25 bg-purple-500 rounded-full"></div>
          </div>
          <div className='mt-10'>
            <ProductGrid products={products}/>
          </div>
        </div>
      </section>
    </>
  )
}

export default PopularProducts
