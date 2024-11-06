import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAuth } from "../store/slices/authSlice";
import { IOrder, OrderStatus } from "../types/Order";
import { Link } from "react-router-dom";

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
    const [cancelling, setCancelling] = useState(false);
    const { token } = useSelector(selectAuth);

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

    const handleUpdateOrderStatus = async (
      orderId: string,
      status: OrderStatus
    ) => {
      try {
        await axios.put(
          `http://localhost:3000/api/orders/api/orders/${orderId}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchOrders(); // Refresh orders after update
      } catch (error) {
        setError("Failed to update order status");
        console.error("Error updating order:", error);
      }
    };

    const canCancel = [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(
      order.status
    );

    return (
      <div className="border rounded-lg p-4 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
          <div>
            <h3 className="text-base md:text-lg font-semibold">
              Order
              <span className="text-gray-500 text-xs ml-2">#{order._id}</span>
            </h3>
            <p className="text-gray-600 text-xs md:text-sm">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-row sm:flex-col items-center gap-2 w-full sm:w-auto">
            <span
              className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${
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
            {canCancel && (
              <button
                onClick={() =>
                  handleUpdateOrderStatus(order.id, OrderStatus.CANCELLED)
                }
                disabled={cancelling}
                className="px-2 md:px-3 py-1 bg-red-500 text-white rounded-full text-xs md:text-sm hover:bg-red-600 disabled:bg-red-300 w-full sm:w-auto"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            <Link
              to={`/consumers/orders/${order._id}`}
              className="px-2 md:px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center text-xs md:text-sm w-full sm:w-auto"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {orderDetails[order._id]?.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <div className="w-full sm:w-auto">
                <p className="font-medium text-sm md:text-base">
                  {item.productDetails.name}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="flex justify-between w-full sm:w-auto gap-4">
                <p className="font-medium text-xs md:text-sm">
                  Unit: ₹{item.unitPrice.toFixed(2)}
                </p>
                <p className="font-medium text-xs md:text-sm">
                  Total: ₹{item.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">
              Total Amount:
            </span>
            <span className="font-bold text-base md:text-lg">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2 text-sm md:text-base">
            Delivery Address:
          </h4>
          <p className="text-gray-600 text-xs md:text-sm">
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zipCode}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
      </div>
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
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Active Orders
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {activeOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 mt-8 md:mt-12">
        Completed & Cancelled Orders
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {completedOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
