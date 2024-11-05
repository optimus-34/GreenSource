import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAuth } from "../store/slices/authSlice";
import { IOrder, OrderStatus } from "../types/Order";
import { Link } from 'react-router-dom';

interface Order extends IOrder {
  _id: string;
}

export default function ConsumerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useSelector(selectAuth);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/orders/api/orders/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Sort orders by date, newest first
      const sortedOrders = response.data.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(
    (order) =>
      ![OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
  );

  const completedOrders = orders.filter((order) =>
    [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
  );

  const OrderCard = ({ order }: { order: Order }) => {
    const [orderDetails, setOrderDetails] = useState<{ [key: string]: any }>(
      {}
    );

    useEffect(() => {
      const fetchOrderDetails = async () => {
        try {
          const itemDetails = await Promise.all(
            order.items.map(async (item) => {
              const response = await axios.get(
                `http://localhost:3000/api/products/${item.productId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                ...item,
                productDetails: response.data,
              };
            })
          );

          setOrderDetails({
            ...orderDetails,
            [order._id]: itemDetails,
          });
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };

      if (!orderDetails[order._id]) {
        fetchOrderDetails();
      }
    }, [order._id]);
    console.log(orderDetails);

    return (
      <Link to={`/consumers/orders/${order._id}`} className="block hover:shadow-md transition-shadow">
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Order
                <span className="text-gray-500 text-xs ml-2">#{order._id}</span>
              </h3>
              <p className="text-gray-600 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                order.status === OrderStatus.DELIVERED
                  ? "bg-green-600 text-white"
                  : order.status === OrderStatus.CONFIRMED
                  ? "bg-green-200 text-green-800"
                  : order.status === OrderStatus.PENDING ||
                    order.status === OrderStatus.ONTHEWAY ||
                    order.status === OrderStatus.SHIPPED
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === OrderStatus.CANCELLED
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-4">
            {orderDetails[order._id]?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.productDetails.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  Unit Price: ₹{item.unitPrice.toFixed(2)}
                </p>
                <p className="font-medium">
                  Total Price: ₹{item.totalPrice.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-lg">
                ₹{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Delivery Address:</h4>
            <p className="text-gray-600">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Active Orders</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {activeOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      <h2 className="text-xl font-bold mb-6 mt-12">
        Completed & Cancelled Orders
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
