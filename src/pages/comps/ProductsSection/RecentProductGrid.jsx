import React from 'react'
import RecentProductCard from './RecentProductCard'

const RecentProductGrid = ({products}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-1 gap-6 p-4">
        {products.slice(0, 4).map((product) => (
            <RecentProductCard key={product.$id} product={product} />
        ))}
      </div>
    </>
  )
}

export default RecentProductGrid
