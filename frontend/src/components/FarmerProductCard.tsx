import React, { useState, useEffect } from "react";
import { IProduct } from "../types/Product";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";

interface FarmerProductCardProps {
  product: IProduct;
}

const FarmerProductCard: React.FC<FarmerProductCardProps> = ({ product }) => {
  const { token } = useSelector(selectAuth);
  const [productImage, setProductImages] = useState<string>();

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${product._id}/images`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          const images = await response.data;
          setProductImages(
            images.imageUrl ? images.imageUrl : "https://placehold.co/300x200"
          );
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };

    fetchProductImages();
  }, [product._id]);

  return (
    <div className="max-w-[300px] max-h-[400px] h-full flex flex-col rounded-lg shadow-md bg-white">
      <div className="relative">
        <img
          className="w-full h-[200px] object-cover rounded-t-lg"
          src={
            productImage === null
              ? "https://placehold.co/300x200"
              : productImage
          }
          alt={product.name}
        />
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
        <div className="text-sm text-gray-600">
          Quantity Available: {product.quantityAvailable} {product.unit}
        </div>
      </div>
    </div>
  );
};

export default FarmerProductCard;
