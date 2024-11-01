import React, { useState, useEffect } from "react";
import { IProduct } from "../types/Product";

interface CartItem extends IProduct {
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

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

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
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
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded">
                  <button
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {
                  /* Implement checkout logic */
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;
