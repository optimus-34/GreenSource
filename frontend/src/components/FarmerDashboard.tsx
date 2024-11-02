import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import { Package, Clock, User, Activity, Wallet } from "lucide-react";

const FarmerDashboard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      icon: <Package className="w-5 h-5" />,
      label: "Products",
      path: "/farmer/products",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Orders",
      path: "/farmer/orders",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      path: "/farmer/profile",
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      label: "Earnings",
      path: "/farmer/earnings",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Activity",
      path: "/farmer/market-prices",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-4">
            <div className="flex items-center mb-6">
              <span className="text-xl font-bold text-green-600">
                Green Source
              </span>
            </div>

            <nav>
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 mb-2 rounded-lg hover:bg-gray-100 ${
                    item.path === window.location.pathname
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white shadow">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-semibold">
                {window.location.pathname.split("/")[2]?.toLocaleUpperCase() ||
                  "Dashboard"}
              </h1>

              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Welcome, {user?.username || "User"}
                </span>
                <button
                  onClick={handleSignout}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
