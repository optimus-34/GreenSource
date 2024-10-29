import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginFailure } from "../store/slices/authSlice";
import axios from "axios";
import type { RootState } from "../store"; // Assuming you have this type defined

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    identifier: "", // This will store either email or username
    password: "",
    userType: "consumer",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/consumer/login",
        formData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.data) {
        // Assuming the API returns { user, token }
        dispatch({
          type: "auth/loginSuccess",
          payload: response.data,
        });

        // Navigate based on user type
        if (formData.userType === "consumer") {
          navigate("/consumer-dashboard");
        } else {
          navigate("/farmer-dashboard");
        }
      }
    } catch (error) {
      dispatch(
        loginFailure(error instanceof Error ? error.message : "Login failed")
      );
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-md">
      <div className="bg-white shadow-lg rounded-lg p-8 mt-16">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex justify-center space-x-6 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="consumer"
                checked={formData.userType === "consumer"}
                onChange={handleInputChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Consumer</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="farmer"
                checked={formData.userType === "farmer"}
                onChange={handleInputChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Farmer</span>
            </label>
          </div>
          <div className="mb-4">
            <input
              type="text"
              id="identifier"
              name="identifier"
              required
              autoFocus
              value={formData.identifier}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email or Username"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-0 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
