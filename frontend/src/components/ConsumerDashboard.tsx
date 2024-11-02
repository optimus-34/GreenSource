import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import {
  ShoppingCart,
  User,
  Package,
  Heart,
  Clock,
  Menu,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ConsumerDashboard = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartCount, setCartCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const handleSignout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!token || !user?.email) {
        console.log("No token or email available");
        return;
      }

      try {
        const response = await axios({
          method: "POST",
          url: `http://localhost:3000/api/customers/api/customers/login`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            email: user.email,
          },
        });

        const { cart = [], wishlist = [], orders = [] } = response.data;

        setCartCount(cart.length);
        setSavedCount(wishlist.length);
        setOrderCount(orders.length);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching customer details:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });

          // Handle unauthorized access
          if (error.response?.status === 401) {
            dispatch(logout());
            navigate("/login");
          }
        } else {
          console.error("Error fetching customer details:", error);
        }
      }
    };
    fetchCustomerDetails();
  }, [user?.email, token, dispatch, navigate]);

  const menuItems = [
    {
      icon: <Package className="w-5 h-5" />,
      label: "Products",
      path: "/consumer/products",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Cart",
      path: "/consumer/cart",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Orders",
      path: "/consumer/orders",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Saved",
      path: "/consumer/saved",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      path: "/consumer/profile",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Market Prices",
      path: "/consumer/market-prices",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Rest of the JSX remains the same */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-5 border-b">
            <h1 className="text-xl font-bold">
              <span className="text-green-500">Green</span>
              <span className="text-blue-800">Source</span>
            </h1>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center justify-between w-full px-4 py-3 mb-2 rounded-lg hover:bg-gray-100 ${
                  item.path === window.location.pathname
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                <div className="flex items-center justify-start">
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </div>
                {item.path === "/consumer/cart" && (
                  <span
                    className={`ml-14 size-6 rounded-full float-end ${
                      cartCount > 0
                        ? "bg-green-500 text-gray-100"
                        : "bg-gray-300 text-zinc-800"
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
                {item.path === "/consumer/orders" && (
                  <span
                    className={`ml-14 size-6 rounded-full ${
                      orderCount > 0
                        ? "bg-blue-500 text-gray-100"
                        : "bg-gray-300 text-zinc-800"
                    }`}
                  >
                    {orderCount}
                  </span>
                )}
                {item.path === "/consumer/saved" && (
                  <span
                    className={`ml-14 size-6 rounded-full ${
                      savedCount > 0
                        ? "bg-red-500 text-gray-100"
                        : "bg-gray-300 text-zinc-800"
                    }`}
                  >
                    {savedCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-auto w-full">
        <header className="bg-white shadow-sm fixed top-0 z-20 w-[calc(100%-250px)]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 lg:hidden" />
              <h2 className="text-xl font-semibold text-gray-800">
                {window.location.pathname.split("/")[2].toLocaleUpperCase()}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                className="px-2 pb-2 pt-1 text-white bg-red-500 rounded-md"
                onClick={handleSignout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
