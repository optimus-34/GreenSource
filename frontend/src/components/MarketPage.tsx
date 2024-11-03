import axios from "axios";
import { useEffect, useState } from "react";

export default function MarketPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("");
        const data = await response.data;
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${product.price}</span>
                {product.priceIncreased ? (
                  <span className="text-red-500 text-sm">Price Increased</span>
                ) : (
                  <span className="text-green-500 text-sm">Price Stable</span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">
                  Category: {product.category}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Stock: {product.stock} units
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
