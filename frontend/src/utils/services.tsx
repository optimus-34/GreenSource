import axios from "axios";

export const getProducts = async (token: string) => {
  const response = await axios.get("http://localhost:3000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
