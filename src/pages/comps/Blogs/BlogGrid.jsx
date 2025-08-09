import React from 'react'
import BlogCard from './BlogCard'

const BlogGrid = ({blogs}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-6 p-4">
        {blogs.map((blog) => (
            <BlogCard key={blog.$id} blog={blog} />
        ))}
      </div>
    </>
  )
}

export default BlogGrid
