import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IProduct } from "../types/Product";
import {
  getCustomerCart,
  removeFromCart,
  createOrder,
} from "../utils/services";
import { selectAuth } from "../store/slices/authSlice";
import axios from "axios";

interface ICartItem {
  productId: string;
  quantity: Number;
}

interface CartItem extends IProduct {
  quantity: number;
  stock: number;
}

interface StockError {
  productId: string;
  availableStock: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector(selectAuth);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [stockErrors, setStockErrors] = useState<StockError[]>([]);

  useEffect(() => {
    if (token && user.email) {
      fetchCartItems();
    }
  }, [token, user.email]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce(
        (sum, item) => sum + item.currentPrice * item.quantity,
        0
      );
      setTotalAmount(total);
    };
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await getCustomerCart(token!, user.email!);
      // Get product details for each cart item
      const cartItemsWithDetails = await Promise.all(
        response.data.map(async (item: ICartItem) => {
          try {
            const productResponse = await axios.get(
              `http://localhost:3000/api/products/${item.productId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return {
              ...productResponse.data,
              quantity: 1, // Default quantity
              stock: productResponse.data.quantityAvailable,
            };
          } catch (err) {
            console.error(`Error fetching product ${item.productId}:`, err);
            return null;
          }
        })
      );

      // Filter out any null values from failed requests
      const validCartItems = cartItemsWithDetails.filter(
        (item): item is CartItem => item !== null
      );
      setCartItems(validCartItems || []);
    } catch (error) {
      setError("Failed to fetch cart items");
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    // Update quantity in the backend
    updateCartInBackend(productId, newQuantity);

    async function updateCartInBackend(productId: string, newQuantity: number) {
      try {
        await axios.put(
          `http://localhost:3000/api/customers/api/customers/${user.email}/cart/${productId}`,
          { quantity: newQuantity },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        setError("Failed to update cart quantity");
        console.error("Error updating cart quantity:", error);
        // Revert the quantity change in UI if backend update fails
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === productId ? { ...item, quantity: item.quantity } : item
          )
        );
      }
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setLoading(true);
      await removeFromCart(token!, user.email!, productId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
    } catch (error) {
      setError("Failed to remove item from cart");
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.currentPrice,
        })),
        totalAmount,
      };

      await createOrder(token!, user.email!, orderData);
      setCartItems([]);
      setError("");
      navigate("/orders"); // Redirect to orders page after successful checkout
    } catch (error) {
      setError("Failed to process checkout");
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 mt-10">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center border rounded-lg p-4 shadow-sm"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500">
                  ${item.currentPrice.toFixed(2)} / {item.unit}
                </p>
                {stockErrors.find((error) => error.productId === item._id) && (
                  <p className="text-red-500 text-sm">
                    Only{" "}
                    {
                      stockErrors.find((error) => error.productId === item._id)
                        ?.availableStock
                    }{" "}
                    items available in stock
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded">
                  <button
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={loading}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold min-w-[80px] text-right">
                  ₹{(item.currentPrice * item.quantity).toFixed(2)}
                </p>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className={`bg-green-600 text-white px-6 py-3 rounded-lg transition-colors ${
                  loading || stockErrors.length > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700"
                }`}
                onClick={handleCheckout}
                disabled={loading || stockErrors.length > 0}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
