import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BlogCard = ({blog}) => {

  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate()

  const image = blog.imageUrl

  const formattedDate = new Date(blog.date).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long'
  }); 

  useEffect(() => {
      let timer;
      if (imageLoaded) {
        timer = setTimeout(() => setLoading(false), 300);
      }
      return () => clearTimeout(timer);
    }, [imageLoaded]);
  

  return (
    <div className="flex flex-col group shadow-lg rounded-md bg-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[3/2]">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 animate-pulse z-10" />
        )}

        <img
          src={image}
          alt={blog.title}
          onLoad={() => setImageLoaded(true)}
          className={`h-full object-cover transition-opacity duration-500 p-4 pb-2 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <div className="absolute top-0 left-0 m-4 px-3 py-1 bg-orange-400/60 bg-opacity-50 text-white text-md font-semibold">
          {blog.Topic}
        </div>
        <div className='absolute bottom-[-25px] left-[-5px] p-2 h-14 w-14 m-4 rounded-[500px] font-bold text-sm text-center bg-rose-600 text-white'>
          {formattedDate}
        </div>
      </div>

      <div className="p-9 pt-4 pb-4 flex flex-col gap-2">
        <h3 className="text-black text-xl font-bold h-21">{blog.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-4 ">{blog.description}</p>
        <button 
          onClick={() => navigate("/detailblogcard", { state: { blog } })}
          className="mt-2 self-start px-4 py-2 bg-purple-700 text-white text-md rounded-lg hover:bg-purple-600 transition cursor-pointer">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default BlogCard
