import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { Trash2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  quantityAvailable: number;
  unit: string;
  category: string;
  images?: { imageUrl: string }[];
}

export default function AdminFarmerProductsPage() {
  const { farmerId } = useParams();
  const { token } = useSelector(selectAuth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [farmerId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/farmers/api/farmers/${farmerId}/get/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch images for each product
      const productsWithImages = await Promise.all(
        response.data.map(async (product: Product) => {
          const imagesResponse = await axios.get(
            `http://localhost:3000/api/products/${product._id}/images`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return { ...product, images: imagesResponse.data };
        })
      );

      setProducts(productsWithImages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  console.log(products[0].images);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Farmer Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product?.images?.[0]?.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <div className="mt-4 space-y-2">
                <p className="text-lg font-semibold text-green-600">
                  ₹{product.currentPrice}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {product.quantityAvailable} {product.unit}
                </p>
                <p className="text-sm text-gray-500">
                  Category: {product.category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
