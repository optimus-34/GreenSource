import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import { Package, Clock, User, Activity, Wallet, Menu, X } from "lucide-react";
import { useState } from "react";

const FarmerDashboard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      label: "Market Prices",
      path: "/farmer/market-prices",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (user && user.userType === "consumer") {
    setTimeout(() => {
      navigate("/consumer/profile");
    }, 2000);
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1>You are not authorized to access this page</h1>
        <h1>Redirecting to consumer profile page</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <span className="text-green-500">Green</span>
          <span className="text-blue-800">Source</span>
        </h1>
        <button onClick={toggleSidebar} className="p-2">
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed md:sticky md:top-0
        w-64 h-[100dvh]
        bg-white shadow-lg 
        transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }
        z-50
      `}
      >
        <div className="flex flex-col h-full">
          <div className="hidden md:block p-5 border-b">
            <h1 className="text-xl font-bold">
              <span className="text-green-500">Green</span>
              <span className="text-blue-800">Source</span>
            </h1>
          </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
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
          <div className="flex flex-col md:flex-row md:items-center justify-end px-4 md:px-6 py-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm md:text-base">
                Welcome, {user?.username || "User"}
              </span>
              <button
                onClick={handleSignout}
                className="px-3 py-1.5 md:px-4 md:py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
