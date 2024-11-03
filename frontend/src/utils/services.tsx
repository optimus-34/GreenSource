import axios from "axios";
// import { IProduct } from "../types/Product";
import { IProductImage } from "../types/Product";

export const getProducts = async (token: string) => {
  const response = await axios.get("http://localhost:3000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createProduct = async (token: string, productData: any) => {
  try {
    // Then add the product to farmer's list_products
    const productResponse = await axios.post(
      `http://localhost:3000/api/farmers/api/farmers/${productData.farmerId}/add/product`,
      { ...productData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return productResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create product"
      );
    }
    throw new Error("Failed to create product");
  }
};

export const getFarmerProducts = async (token: string, email: string) => {
  console.log("email", email);
  console.log("token", token);
  const response = await axios.get(
    `http://localhost:3000/api/farmers/api/farmers/${email}/get/products`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export const addProductImage = async (
  token: string,
  productId: string,
  imageData: Partial<IProductImage>
) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/products/${productId}/images`,
      imageData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to add product image"
      );
    }
    throw new Error("Failed to add product image");
  }
};
