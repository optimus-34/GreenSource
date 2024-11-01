import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import { ShoppingCart, User, Package, Heart, Clock, Menu } from "lucide-react";
// import { useEffect } from "react";

const ConsumerDashboard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const handleSignout = async () => {
    logout();
    navigate("/login");
  };

  const cartCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/customer/${user.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching cart count:", error);
      return 0;
    }
  };

  const cartCountValue = cartCount().then((data) => {
    return data.cart.length;
  });
  const orderCountValue = cartCount().then((data) => {
    return data.orders.length;
  });
  const savedCountValue = cartCount().then((data) => {
    return data.wishlist.length;
  });

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
  ];
  // useEffect(() => {
  //   if (!user.name) {
  //     navigate("/login");
  //     return;
  //   }
  // }, [user, navigate]);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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
                className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg hover:bg-gray-100 ${
                  item.path === window.location.pathname
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {item.path === "/consumer/cart" && (
                  <span className="ml-1 text-gray-100 bg-green-500 rounded-full p-2">
                    {cartCountValue.toString()}
                  </span>
                )}
                {item.path === "/consumer/orders" && (
                  <span className="ml-1 text-gray-500">
                    {orderCountValue.toString()}
                  </span>
                )}
                {item.path === "/consumer/saved" && (
                  <span className="ml-1 text-gray-500">
                    {savedCountValue.toString()}
                  </span>
                )}
              </button>
            ))}{" "}
          </nav>
        </div>
      </div>

      {/* Main Content */}
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
                Welcome, {user.username}
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

        <main className="p-6">
          {/* <Outlet /> */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
