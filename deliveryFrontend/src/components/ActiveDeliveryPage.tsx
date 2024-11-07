import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { IDelivery } from "../types/Delivery";

interface Delivery extends IDelivery {
  _id: string;
}

export default function ActiveDeliveryPage() {
  const { user, token } = useSelector(selectAuth);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const agent = await axios.get(
          `http://localhost:3000/api/delivery/agent/email/${user?.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(agent);
        const response = await axios.get(
          `http://localhost:3000/api/delivery/agents/${agent?.data?._id}/deliveries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setDeliveries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch deliveries");
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Active Deliveries</h1>

      {deliveries.length === 0 ? (
        <p className="text-gray-600">No active deliveries found</p>
      ) : (
        deliveries.map((delivery) => (
          <div
            key={delivery._id}
            className="bg-white rounded-lg shadow-md mb-4 p-6"
          >
            <h2 className="text-xl font-semibold mb-3">
              Order ID: {delivery.orderId}
            </h2>
            <p className="text-gray-700 mb-2">Status: {delivery.status}</p>
            <p className="text-gray-700 mb-2">
              Pickup: {delivery.pickupAddress}
            </p>
            <p className="text-gray-700 mb-2">
              Dropoff: {delivery.deliveryAddress}
            </p>
            <p className="text-gray-700 mb-2">Farmer: {delivery.farmerId}</p>
            <p className="text-gray-700 mb-2">
              Phone: {delivery.farmerPhoneNumber}
            </p>
            <p className="text-gray-700 mb-2">
              Customer: {delivery.consumerId}
            </p>
            <p className="text-gray-700">
              Phone: {delivery.consumerPhoneNumber}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
