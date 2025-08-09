import React, { useEffect, useState } from 'react'
import BlogGrid from './BlogGrid'
import { useNavigate } from 'react-router-dom';
import service from '@/lib/appwrite/service';

const Blogs = () => {

  const [blogs, setBlogs] = useState([]);
  const [blogImages, setBlogImages] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogsAndImages = async () => {
      const data = await service.getAllBlogs();
      setBlogs(data);
    };

    fetchBlogsAndImages();
  }, []);

  return (
    <>
      <section id='blogs' className='mt-10'>
        <div className='max-w-6xl mx-auto'>
          <div>
            <div className='text-center uppercase font-semibold text-rose-400'>Recent Blogs</div>
          </div>
          <div className='mt-5'>
            <div 
              style={{
                        fontFamily: '"Style Script", cursive',
                        fontWeight: 900,
                        fontStyle: 'normal'
                    }} 
              className='font-black text-4xl font-script text-center'>Our Latest News</div>
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
            <BlogGrid blogs={blogs}/>
          </div>
        </div>
      </section>
    </>
  )
}

export default Blogs
