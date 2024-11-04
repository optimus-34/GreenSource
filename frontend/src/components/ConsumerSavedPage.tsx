import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { getCustomerCart } from "../utils/services"; // Importing the service function
import { IProduct } from "../types/Product";
import { addToWishlist, setWishlist } from "../store/slices/wishlistSlice"; // Importing the action
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ConsumerSavedPage() {
  const { user, token } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const wishlist = useSelector(
    (state: { wishlist: { items: IProduct[] } }) => state.wishlist.items
  ); // Accessing wishlist from Redux state

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user.email || !token) {
        console.error("User email or token is missing.");
        return;
      }

      try {
        const response = await getCustomerCart(token, user.email); // Using the service function
        const productIds = response.data.map(
          (item: { productId: string }) => item.productId
        );

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

        dispatch(setWishlist(productDetails.filter(Boolean))); // Set wishlist in Redux state
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [user.email, token, dispatch]);

  return (
    <div>
      <h1>Wishlist</h1>
      <ul>
        {wishlist.map((item: IProduct) => (
          <ProductCard
            key={item._id}
            product={item}
            onAddToWishlist={() => addToWishlist}
          />
        ))}
      </ul>
    </div>
  );
}
