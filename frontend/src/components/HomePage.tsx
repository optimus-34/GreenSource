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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 mt-16">
        {/* Hero Section */}
        <div className="relative bg-[url('/assets/bg.jpg')] bg-cover bg-top bg-no-repeat py-16 min-h-[25rem] flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-10 animate-fade-in-down">
                <span>
                  <span className="text-green-400">Green</span>
                  <span className="text-blue-300">Source</span>
                </span>{" "}
                <span className="block mt-4">Marketplace</span>
              </h1>
              <button
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white"
                onClick={handleGetStarted}
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gradient-to-b from-white to-green-50 -mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-green-600 text-5xl mb-6">🌾</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Direct from Farmers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Purchase fresh produce directly from local farmers, ensuring
                  they receive fair compensation
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-green-600 text-5xl mb-6">🚛</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Fast Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get your fresh produce delivered straight to your doorstep
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-green-600 text-5xl mb-6">💰</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Better Prices</h3>
                <p className="text-gray-600 leading-relaxed">
                  Eliminate middlemen and get better prices for both farmers and
                  consumers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="h-56 bg-gradient-to-br from-green-400 to-emerald-600"></div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-800">Organic Vegetables</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Fresh from local farms
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 text-xl font-bold">$4.99/kg</span>
                      <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors shadow-md hover:shadow-lg">
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
        <div className="bg-gradient-to-r from-green-400 to-emerald-600 py-32 min-h-[40rem] flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Are you a farmer?</h2>
            <p className="text-xl mb-10 opacity-90">
              Join our platform and start selling your produce directly to
              consumers
            </p>
            <button
              className="bg-white backdrop-blur-sm bg-opacity-20 text-white px-12 py-4 rounded-full font-bold hover:bg-opacity-30 transition-all transform hover:scale-105 shadow-xl border-2 border-white"
              onClick={handleGetStarted}
            >
              Register as Farmer
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold text-xl mb-6">About Us</h4>
                <p className="text-gray-400 leading-relaxed">
                  Connecting farmers directly with consumers for a sustainable
                  future.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      For Farmers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      For Consumers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-6">Contact</h4>
                <ul className="space-y-4">
                  <li className="text-gray-400">
                    Email: support@farmmarket.com
                  </li>
                  <li className="text-gray-400">Phone: (555) 123-4567</li>
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
