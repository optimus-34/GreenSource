import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Package, Clock, User } from "lucide-react";
import { OrderTracker } from "./OrderTracker";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { IOrder } from "../types/Order";

interface DeliveryLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface Order extends IOrder {
  _id: string;
}

interface Delivery {
  _id: string;
  orderId: string;
  farmerId: string;
  customerId: string;
  agentId?: string;
  status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "ON_WAY" | "DELIVERED";
  deliveryLocation: DeliveryLocation;
}

interface DeliveryStatusUpdate {
  status:
    | "PENDING"
    | "ASSIGNED"
    | "PICKED_UP"
    | "ON_WAY"
    | "DELIVERED"
    | "CANCELLED";
  location?: {
    coordinates: [number, number];
  };
}

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const { token } = useSelector(selectAuth);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details from order service
        const orderResponse = await axios.get(
          `http://localhost:3000/api/orders/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const orderData = await orderResponse.data;
        setOrder(orderData);

        // Fetch delivery details from delivery service
        const deliveryResponse = await axios.get(
          `http://localhost:3000/api/delivery/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const deliveryData = await deliveryResponse.data;
        setDelivery(deliveryData);
      } catch (error) {}
    };

    if (orderId) {
      fetchOrderDetails();
    }
    console.log(order);
  }, [orderId]);

  const getItemDetails = async (productId: string) => {
    const response = await axios.get(
      `http://localhost:3000/api/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const updateDeliveryStatus = async (statusUpdate: DeliveryStatusUpdate) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/delivery/${delivery?._id}/status`,
        statusUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDelivery(response.data);
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  const renderDeliveryAgentControls = () => {
    if (!delivery || !delivery.agentId) return null;

    return (
      <div className="mt-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Delivery Controls</h3>
        <div className="flex gap-4">
          {delivery.status === "ASSIGNED" && (
            <button
              onClick={() => updateDeliveryStatus({ status: "PICKED_UP" })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Mark as Picked Up
            </button>
          )}
          {delivery.status === "PICKED_UP" && (
            <button
              onClick={() => updateDeliveryStatus({ status: "ON_WAY" })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start Delivery
            </button>
          )}
          {delivery.status === "ON_WAY" && (
            <button
              onClick={() => updateDeliveryStatus({ status: "DELIVERED" })}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!order) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Order #{order._id}</h2>
        <p className="text-gray-600">
          <Clock className="inline-block w-4 h-4 mr-1" />
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <OrderTracker order={order} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Delivery Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div className="ml-3">
                <p className="font-medium">Delivery Address</p>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Order Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {order.items.map((item) => {
              const itemDetails = getItemDetails(item.productId);
              console.log(itemDetails);
              return (
                <div
                  key={item.productId}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-gray-500 mr-2" />
                    <span>{item.productId}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₹{item.unitPrice.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {delivery && delivery.agentId && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <User className="w-5 h-5 text-blue-500" />
            <div className="ml-3">
              <p className="font-medium">Delivery Agent</p>
              <p className="text-gray-600">
                Your order will be delivered by Agent #{delivery.agentId}
              </p>
              <p className="text-gray-600">Status: {delivery.status}</p>
            </div>
          </div>
        </div>
      )}

      {renderDeliveryAgentControls()}
    </div>
  );
}
