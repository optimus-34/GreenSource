import axios from "axios";
// import { IProduct } from "../types/Product";

export const getProducts = async (token: string) => {
  const response = await axios.get("http://localhost:3000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getFarmerProducts = async (token: string) => {
  const response = await axios.get(
    "http://localhost:3000/api/farmers/api/login",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        farmer_id: 101,
      },
    }
  );
  return response.data;
};

const API_URL = "http://localhost:3000/api/customers/api/customers";

export const addToCartService = async (productId: string, token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        productId,
        quantity: 1,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to add to cart");
    }
    throw new Error("Failed to add to cart");
  }
};

export const getCartItems = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/cart`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch cart items"
      );
    }
    throw new Error("Failed to fetch cart items");
  }
};
