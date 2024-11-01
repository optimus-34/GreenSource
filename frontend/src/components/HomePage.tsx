import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    // Redirect to the login page
    navigate("/login");
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 mt-16">
        {/* Hero Section */}
        <div className="relative bg-[url('/assets/bg.jpg')] bg-cover bg-center bg-no-repeat py-32 min-h-[40rem] flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="text-center text-zinc-900 mt-14">
              <h1 className="text-4xl md:text-6xl font-bold mb-10 mt-32 text-zinc-900">
                <span>
                  <span className="text-green-500">Green</span>
                  <span className="text-blue-800">Source</span>
                </span>{" "}
                Marketplace
              </h1>
              {/* <h3 className="text-xl mb-8 mt-4 text-zinc-900 font-extrabold font-bold">
              Connect directly with local farmers and get fresh produce at fair prices
              </h3> */}
              <button
                className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-100 transition-colors"
                onClick={handleGetStarted}
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-green-600 text-4xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold mb-2">
                  Direct from Farmers
                </h3>
                <p className="text-gray-600">
                  Purchase fresh produce directly from local farmers, ensuring
                  they receive fair compensation
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-green-600 text-4xl mb-4">🚛</div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your fresh produce delivered straight to your doorstep
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-green-600 text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Better Prices</h3>
                <p className="text-gray-600">
                  Eliminate middlemen and get better prices for both farmers and
                  consumers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Organic Vegetables</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Fresh from local farms
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold">$4.99/kg</span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-green-100 py-32 min-h-[40rem] flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Are you a farmer?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our platform and start selling your produce directly to
              consumers
            </p>
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
              onClick={handleGetStarted}
            >
              Register as Farmer
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-green-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">About Us</h4>
                <p className="text-green-200">
                  Connecting farmers directly with consumers for a sustainable
                  future.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-green-200 hover:text-white">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-green-200 hover:text-white">
                      For Farmers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-green-200 hover:text-white">
                      For Consumers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="text-green-200">
                    Email: support@farmmarket.com
                  </li>
                  <li className="text-green-200">Phone: (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
