import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DeliveryAgent {
  email: string;
  name: string;
  phoneNumber: string;
  orders?: {
    _id: string;
    orderDate: string;
    totalAmount: number;
    status: string;
  }[];
}

export default function AdminDeliveryAgentsView() {
  const { token } = useSelector(selectAuth);
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: { orders: boolean };
  }>({});

  useEffect(() => {
    fetchDeliveryAgents();
  }, []);

  const fetchDeliveryAgents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/delivery/agents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const agentsWithDetails = await Promise.all(
        response.data.map(async (agent: DeliveryAgent) => {
          const ordersRes = await axios.get(
            `http://localhost:3000/api/delivery/agents/${agent.email}/deliveries`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          return {
            ...agent,
            orders: ordersRes.data,
          };
        })
      );

      setDeliveryAgents(agentsWithDetails);
      const initialExpandedState = agentsWithDetails.reduce(
        (acc, agent) => ({
          ...acc,
          [agent.email]: { orders: false },
        }),
        {}
      );
      setExpandedSections(initialExpandedState);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching delivery agents:", error);
      setError("Failed to fetch delivery agents data");
      setLoading(false);
    }
  };

  const toggleSection = (agentEmail: string, section: "orders") => {
    setExpandedSections((prev) => ({
      ...prev,
      [agentEmail]: {
        ...prev[agentEmail],
        [section]: !prev[agentEmail][section],
      },
    }));
  };

  if (loading) return <div className="p-4 md:p-6 lg:p-8">Loading...</div>;
  if (error)
    return <div className="p-4 md:p-6 lg:p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Delivery Agents Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {deliveryAgents.map((agent) => (
          <div
            key={agent.email}
            className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {agent.name.split(" ")[0].charAt(0)}
                      {agent.name.split(" ")[1].charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold">{agent.name}</h2>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    {agent.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    {agent.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                onClick={() => toggleSection(agent.email, "orders")}
              >
                <h3 className="font-medium text-sm">
                  Orders ({agent.orders?.length || 0})
                </h3>
                {expandedSections[agent.email]?.orders ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
              {expandedSections[agent.email]?.orders && (
                <div className="mt-2 space-y-2">
                  {agent.orders && agent.orders.length > 0 ? (
                    agent.orders.slice(0, 3).map((order) => (
                      <div
                        key={order._id}
                        className="bg-gray-50 p-3 rounded-md text-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              Order #{order._id.slice(-6)}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{order.totalAmount}</p>
                            <p className="text-xs">{order.status}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No orders yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
