import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import axios from "axios";
import { IProduct } from "../types/Product";

export default function ConsumerSavedPage() {
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const { user, token } = useSelector(selectAuth);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/customers/api/customers/${user.email}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        const productIds = response.data.map((item: {product}) => item.productId);
        const fetchProductDetails = async () => {
          const productDetails = await Promise.all(
            productIds.map(async (productId: string) => {
              try {
                const detailResponse = await axios.get(
                  `http://localhost:3000/api/products/${productId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                return detailResponse.data;
              } catch (error) {
                console.error(
                  `Error fetching product detail for ${productId}:`,
                  error
                );
                return null;
              }
            })
          );
          setWishlist(productDetails.filter(Boolean));
        };
        fetchProductDetails();
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [user.email, token]);

  return (
    <div>
      <h1>Wishlist</h1>
      <ul>
        {wishlist.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
