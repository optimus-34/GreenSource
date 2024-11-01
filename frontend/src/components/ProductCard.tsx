import React from "react";
import { IProduct } from "../types/Product";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="max-w-[300px] max-h-[400px] h-full flex flex-col rounded-lg shadow-md bg-white">
      <div className="relative">
        <img
          className="w-full h-[200px] object-cover rounded-t-lg"
          src="https://placehold.co/300x200"
          alt={product.name}
        />
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
          aria-label="Add to wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600 hover:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4 flex-grow">
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-blue-600">
            ${product.currentPrice.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            Category: {product.category}
          </span>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Add to cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
