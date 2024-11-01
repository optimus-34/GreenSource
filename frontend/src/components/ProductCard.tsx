import React from "react";
import { IProduct } from "../types/Product";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="max-w-[300px] max-h-[400px] h-full flex flex-col rounded-lg shadow-md bg-white">
      <img
        className="w-full h-[200px] object-cover rounded-t-lg"
        src="https://placehold.co/300x200"
        alt={product.name}
      />
      <div className="p-4 flex-grow">
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-blue-600">
            ${product.currentPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-600">
            {product.quantityAvailable} {product.unit} available
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Category: {product.category}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
