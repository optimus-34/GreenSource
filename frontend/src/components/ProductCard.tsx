import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IProduct } from "../types/Product";
import { selectAuth } from "../store/slices/authSlice";
import { addToCartService } from "../utils/services";
import axios from "axios";
// import { Toast } from "@/components/ui/toast";
// import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, token } = useSelector(selectAuth);
  const [isAdding, setIsAdding] = useState(false);
  // const { toast } = useToast();

  const [productImages, setProductImages] = useState<string>();

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

  const handleAddToCart = async () => {
    // if (!token) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Please login to add items to cart",
    //   });
    //   return;
    // }

    try {
      setIsAdding(true);
      console.log(product._id);
      console.log(token, user.email);

      const response = await addToCartService(
        product._id,
        token as string,
        user.email as string
      );

      if (response) {
        // Cart updated successfully
        console.log("Item added to cart successfully");
      }

      // toast({
      //   title: "Success",
      //   description: "Item added to cart",
      // });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add to cart";
      console.error(errorMessage);

      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: errorMessage,
      // });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-w-[300px] max-w-[300px] min-h-[400px] max-h-[400px] h-full flex flex-col rounded-lg shadow-md bg-white">
      <div className="relative">
        <img
          className="w-full h-[200px] object-cover rounded-t-lg"
          src={
            productImages === ""
              ? "https://placehold.com/300x200"
              : productImages
          }
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
        <div className="flex flex-col justify-between items-start w-full mb-2">
          <span className="text-sm text-gray-600 mb-1">
            {product.description}
          </span>
          <span className="text-xs text-gray-600">
            Seller: {product.farmerName}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-blue-600">
            ₹{product.currentPrice.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            Category: {product.category}
          </span>
        </div>
        <button
          className={`w-full py-2 rounded-md transition-colors ${
            isAdding
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label="Add to cart"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
