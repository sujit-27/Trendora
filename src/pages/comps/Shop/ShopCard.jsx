import React from 'react';
import ShopProductCard from './ShopProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ShopCard = ({ products }) => {
  const navigate = useNavigate();
  const groupedProducts = {};

  products.forEach((product) => {
    const category = product.category
      ? product.category.split('-')[0].trim().toLowerCase()
      : 'uncategorized';

    if (!groupedProducts[category]) {
      groupedProducts[category] = [];
    }
    groupedProducts[category].push(product);
  });

  const sortedCategories = [
    'electronics',
    'fashion',
    ...Object.keys(groupedProducts).filter(
      (cat) => cat !== 'electronics' && cat !== 'fashion'
    ),
  ];

  return (
    <div className="space-y-8">
      {sortedCategories.map(
        (category) =>
          groupedProducts[category] &&
          groupedProducts[category].length > 0 && (
            <section key={category}>
              {/* Heading + Button */}
              <div className="flex flex-row items-center justify-between gap-3">
                <h2 className="text-3xl font-bold text-gray-800 capitalize">
                  {category}
                </h2>
                <Button
                  className="sm:w-auto"
                  onClick={() =>
                    navigate(
                      category.toLowerCase() === 'health'
                        ? '/beauty'
                        : `/${category.toLowerCase()}`
                    )
                  }
                >
                  Show more
                </Button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-7">
                {groupedProducts[category]
                  .slice(0, 4)
                  .map((product) => (
                    <ShopProductCard key={product.$id} product={product} />
                  ))}
              </div>
            </section>
          )
      )}
    </div>
  );
};

export default ShopCard;
