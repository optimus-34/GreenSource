import React, { useState, useEffect } from "react";
import { IProduct } from "../types/Product";
import axios, { AxiosError } from "axios";

interface CartItem extends IProduct {
  quantity: number;
  stock: number;
}

interface StockError {
  productId: string;
  availableStock: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [stockErrors, setStockErrors] = useState<StockError[]>([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

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
      const response = await axios.get("/api/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(`/api/cart/${productId}`, {
        quantity: newQuantity,
      });

      if (response.data.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
        setStockErrors((errors) =>
          errors.filter((error) => error.productId !== productId)
        );
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.stockError) {
        setStockErrors((errors) => [
          ...errors.filter((err) => err.productId !== productId),
          {
            productId,
            availableStock: error.response?.data.availableStock,
          },
        ]);
      }
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await axios.delete(`/api/cart/${productId}`);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
      setStockErrors((errors) =>
        errors.filter((error) => error.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/checkout", {
        items: cartItems,
      });

      if (response.data.success) {
        setCartItems([]);
        setStockErrors([]);
        // Redirect to success page or show success message
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.stockErrors) {
          setStockErrors(error.response.data.stockErrors);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
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
                  ${(item.currentPrice * item.quantity).toFixed(2)}
                </p>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item._id)}
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
                ${totalAmount.toFixed(2)}
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
