import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DeliveryAgent {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  deliveries?: {
    _id: string;
    orderId: string;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminDeliveryAgentsView() {
  const { token } = useSelector(selectAuth);
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
          const deliveriesRes = await axios.get(
            `http://localhost:3000/api/delivery/agents/${agent._id}/deliveries`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          return {
            ...agent,
            deliveries: deliveriesRes.data,
          };
        })
      );

      setDeliveryAgents(agentsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching delivery agents:", error);
      setError("Failed to fetch delivery agents data");
      setLoading(false);
    }
  };

  const toggleSection = (agentEmail: string) => {
    setExpandedSection(expandedSection === agentEmail ? null : agentEmail);
  };

  if (loading) return <div className="p-4 md:p-6 lg:p-8">Loading...</div>;
  if (error)
    return <div className="p-4 md:p-6 lg:p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Delivery Agents Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryAgents.map((agent) => (
          <div
            key={agent.email}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">
                      {agent.name.split(" ")[0].charAt(0)}
                      {agent.name.split(" ")[1]?.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {agent.name}
                  </h2>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <span className="font-semibold text-gray-700">Email:</span>
                    {agent.email}
                  </p>
                  <p className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <span className="font-semibold text-gray-700">Phone:</span>
                    {agent.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <div
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                onClick={() => toggleSection(agent.email)}
              >
                <h3 className="font-semibold text-gray-700">
                  Deliveries ({agent.deliveries?.length || 0})
                </h3>
                {expandedSection === agent.email ? (
                  <ChevronUp className="text-blue-500" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400" size={20} />
                )}
              </div>
              {expandedSection === agent.email && (
                <div className="mt-3 space-y-3">
                  {agent.deliveries && agent.deliveries.length > 0 ? (
                    agent.deliveries.slice(0, 3).map((delivery) => (
                      <div
                        key={delivery._id}
                        className="bg-gray-50 p-4 rounded-lg text-sm hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">
                              Delivery #{delivery._id.slice(-6)}
                            </p>
                            <p className="text-gray-600">
                              Order: #{delivery.orderId.slice(-6)}
                            </p>
                            <p className="text-gray-500">
                              {new Date(
                                delivery.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                delivery.status === "DELIVERED"
                                  ? "bg-green-100 text-green-700"
                                  : delivery.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {delivery.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm p-3">
                      No deliveries yet
                    </p>
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
