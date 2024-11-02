import { useEffect, useState } from "react";
import { IProduct } from "../types/Product";
import { getFarmerProducts } from "../utils/services";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";

export default function FarmerProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector(selectAuth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFarmerProducts(token || "");
        setProducts(data);
        setLoading(false);
      } catch (err: unknown) {
        setError(`Failed to fetch products ${err}`);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) {
    return <p className="text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-lg text-red-600">{error}</p>;
  }

  return (
    <div className="flex-grow p-8 mt-10">
      <div className="flex flex-wrap justify-start items-start gap-6">
        {products.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
