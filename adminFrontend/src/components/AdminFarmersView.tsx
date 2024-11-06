import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Farmer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  is_verified: boolean;
  products?: {
    _id: string;
    name: string;
    currentPrice: number;
  }[];
  orders?: {
    _id: string;
    orderDate: string;
    totalAmount: number;
    status: string;
  }[];
}

export default function AdminFarmersView() {
  const { token } = useSelector(selectAuth);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: {products: boolean, orders: boolean}}>({});

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/farmers/api/farmers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch products and orders for each farmer
      const farmersWithDetails = await Promise.all(
        response.data.map(async (farmer: Farmer) => {
          const [productsRes, ordersRes] = await Promise.all([
            axios.get(
              `http://localhost:3000/api/farmers/api/farmers/${farmer.email}/get/products`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              `http://localhost:3000/api/orders/api/orders/${farmer.email}/farmers`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
          ]);

          return {
            ...farmer,
            products: productsRes.data,
            orders: ordersRes.data,
          };
        })
      );

      setFarmers(farmersWithDetails);
      // Initialize expanded states
      const initialExpandedState = farmersWithDetails.reduce((acc, farmer) => ({
        ...acc,
        [farmer.email]: { products: false, orders: false }
      }), {});
      setExpandedSections(initialExpandedState);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setError("Failed to fetch farmers data");
      setLoading(false);
    }
  };

  const handleVerifyFarmer = async (email: string, verify: boolean) => {
    try {
      await axios.put(
        `http://localhost:3000/api/farmers/api/farmers/${email}/update/is_verified`,
        { is_verified: verify },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFarmers(); // Refresh the list
    } catch (error) {
      console.error("Error updating farmer verification:", error);
    }
  };

  const handleDeleteFarmer = async (email: string) => {
    try {
      // Delete from auth service
      await axios.delete(`http://localhost:3000/api/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Delete farmer's products from product service
      const productsResponse = await axios.get(
        `http://localhost:3000/api/farmers/api/farmers/${email}/get/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const products = productsResponse.data;

      for (const product of products) {
        await axios.delete(`http://localhost:3000/api/products/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Delete orders associated with farmer
      await axios.delete(
        `http://localhost:3000/api/orders/api/orders/${email}/farmers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Finally delete from farmer service
      await axios.delete(
        `http://localhost:3000/api/farmers/api/farmers/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh farmers list
      fetchFarmers();
    } catch (error) {
      console.error("Error deleting farmer:", error);
    }
  };

  const toggleSection = (farmerEmail: string, section: 'products' | 'orders') => {
    setExpandedSections(prev => ({
      ...prev,
      [farmerEmail]: {
        ...prev[farmerEmail],
        [section]: !prev[farmerEmail][section]
      }
    }));
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Farmers Management</h1>

      <div className="grid grid-cols-1 gap-6">
        {farmers.map((farmer) => (
          <div key={farmer.email} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {farmer.firstName} {farmer.lastName}
                </h2>
                <p className="text-gray-600">Email: {farmer.email}</p>
                <p className="text-gray-600">Phone: {farmer.phone}</p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      farmer.is_verified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {farmer.is_verified ? "Verified" : "Not Verified"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                {!farmer.is_verified ? (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleVerifyFarmer(farmer.email, true)}
                    >
                      Verify
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteFarmer(farmer.email)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleVerifyFarmer(farmer.email, false)}
                  >
                    Revoke Verification
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div 
                className="flex justify-between items-center mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => toggleSection(farmer.email, 'products')}
              >
                <h3 className="font-semibold">
                  Products Listed: ({farmer.products?.length || 0})
                </h3>
                <div className="flex items-center">
                  <Link
                    to={`/admin/farmers/${farmer.email}/products`}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View All Products →
                  </Link>
                  {expandedSections[farmer.email]?.products ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {expandedSections[farmer.email]?.products && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {farmer.products && farmer.products.length > 0 ? (
                    farmer.products.map((product) => (
                      <div
                        key={product._id}
                        className="bg-gray-50 p-2 rounded text-sm"
                      >
                        <p>{product.name}</p>
                        <p className="text-gray-600">
                          Price: ${product.currentPrice}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No products listed</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              <div 
                className="flex justify-between items-center mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => toggleSection(farmer.email, 'orders')}
              >
                <h3 className="font-semibold">
                  Recent Orders: ({farmer.orders?.length || 0})
                </h3>
                <div className="flex items-center">
                  <Link
                    to={`/admin/farmers/${farmer.email}/orders`}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View All Orders →
                  </Link>
                  {expandedSections[farmer.email]?.orders ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {expandedSections[farmer.email]?.orders && (
                <div className="grid grid-cols-1 gap-2">
                  {farmer.orders && farmer.orders.length > 0 ? (
                    farmer.orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-gray-50 p-2 rounded text-sm"
                      >
                        <p>Order ID: {order._id}</p>
                        <p>
                          Date: {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p>Amount: ${order.totalAmount}</p>
                        <p>Status: {order.status}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No orders yet</p>
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
