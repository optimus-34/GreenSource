import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Package, Clock, User } from "lucide-react";
import { OrderTracker } from "./OrderTracker";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";

interface DeliveryLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface Order {
  id: string;
  farmerId: string;
  customerId: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: [number, number];
  };
}

interface Delivery {
  orderId: string;
  farmerId: string;
  customerId: string;
  agentId?: string;
  status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED";
  deliveryLocation: DeliveryLocation;
}

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
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
          `http://localhost:3000/api/deliveries/order/${orderId}`,
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

  const createDelivery = async () => {
    try {
      const response = await axios.post("/api/deliveries", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        orderId,
        farmerId: order?.farmerId,
        customerId: order?.customerId,
        deliveryLocation: {
          type: "Point",
          coordinates: order?.deliveryLocation.coordinates,
        },
      });

      const newDelivery = await response.data;
      setDelivery(newDelivery);
    } catch (error: unknown) {
      console.error("Error creating delivery:", error);
    }
  };
  console.log(delivery, order);

  if (!order) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
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
                <p className="text-gray-600">
                  {order.deliveryLocation.address}
                </p>
                <p className="text-gray-600">
                  {order.deliveryLocation.city}, {order.deliveryLocation.state}{" "}
                  {order.deliveryLocation.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Order Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {order.products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-gray-500 mr-2" />
                  <span>{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${product.price.toFixed(2)} x {product.quantity}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!delivery && (
        <div className="mt-6">
          <button
            onClick={createDelivery}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Assign Delivery Agent
          </button>
        </div>
      )}

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
    </div>
  );
}
