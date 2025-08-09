import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailBlogCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog;

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!blog) {
      navigate("/");
    }
  }, [blog, navigate]);

  if (!blog) return null;

  const formattedDate = new Date(blog.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-lg shadow-xl transition-shadow duration-500">
      <div className="relative rounded-lg overflow-hidden shadow-md">
        {!imageLoaded && (
          <div className="w-full h-64 bg-gray-300 animate-pulse rounded-t-lg" />
        )}
        <img
          src={blog.imageUrl}
          alt={blog.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-64 object-cover rounded-t-lg transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
        <div className="absolute top-5 left-5 bg-orange-500/90 text-white px-4 py-1.5 rounded-full font-semibold shadow-lg select-none pointer-events-none text-sm sm:text-base">
          {blog.Topic}
        </div>
      </div>

      <article className="mt-8 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 tracking-tight mb-4">
          {blog.title}
        </h1>

        <time
          dateTime={blog.date}
          className="block mb-6 text-gray-500 text-sm sm:text-base"
        >
          Published on {formattedDate}
        </time>

        <p className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-line">
          {blog.description}
        </p>
      </article>

      <div className="mt-10 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 focus:outline-none cursor-pointer"
          aria-label="Go back to previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 -ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold text-sm sm:text-base">Go Back</span>
        </button>
      </div>
    </section>
  );
};

export default DetailBlogCard;
