import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupStart, signupFailure } from "../store/slices/authSlice";
import axios, { AxiosResponse } from "axios";
import type { RootState } from "../store";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [userType, setUserType] = useState<"consumer" | "farmer">("consumer");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      isDefault: true,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      dispatch(signupFailure("Passwords don't match"));
      return false;
    }
    if (userType === "farmer" && !formData.phone) {
      dispatch(signupFailure("Phone number is required for farmers"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(signupStart());

    const signupData = {
      org_id: "653000000000000000000000",
      email: formData.email,
      username: formData.username,
      password: formData.password,
      // firstName: formData.firstName,
      // lastName: formData.lastName,
      // phone: formData.phone,
      role: userType,
      // addresses: showAddressForm ? [formData.address] : [],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        signupData,
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
          },
        }
      );
      let responseData: AxiosResponse<never, never>;
      if (userType === "farmer") {
        responseData = await axios.post(
          "http://localhost:3002/api/farmers/",
          {
            addresses: showAddressForm ? [formData.address] : [],
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            list_products: [],
            list_sales: [],
          },
          {
            headers: {
              "Content-Type": "application/json",
              // "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } else {
        responseData = await axios.post(
          "http://localhost:3001/api/customers/",
          {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            role: userType,
            cart: [],
            wishlist: [],
            orders: [],
            addresses: showAddressForm ? [formData.address] : [],
          },
          {
            headers: {
              "Content-Type": "application/json",
              // "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      if (response.data && responseData.data) {
        dispatch({
          type: "auth/signupSuccess",
          payload: response.data,
        });

        navigate(userType === "consumer" ? "/consumer/products" : "/farmer/products");
      }
    } catch (error) {
      dispatch(
        signupFailure(error instanceof Error ? error.message : "Signup failed")
      );
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg p-8 mt-8 mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div className="flex justify-center space-x-6 mb-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="consumer"
                checked={userType === "consumer"}
                onChange={(e) =>
                  setUserType(e.target.value as "consumer" | "farmer")
                }
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Consumer</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="farmer"
                checked={userType === "farmer"}
                onChange={(e) =>
                  setUserType(e.target.value as "consumer" | "farmer")
                }
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Farmer</span>
            </label>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(userType === "farmer" || formData.phone) && (
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number {userType === "farmer" && "*"}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required={userType === "farmer"}
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="addAddress"
              checked={showAddressForm}
              onChange={(e) => setShowAddressForm(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor="addAddress" className="text-sm text-gray-700">
              Add address now
            </label>
          </div>

          {/* Address Form */}
          {showAddressForm && (
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <h3 className="text-lg font-medium">Address Details</h3>
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="address.street"
                  required={showAddressForm}
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    required={showAddressForm}
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="address.state"
                    required={showAddressForm}
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="address.country"
                    required={showAddressForm}
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="address.zipCode"
                    required={showAddressForm}
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="mb-4">
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-500 hover:underline">
              login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
