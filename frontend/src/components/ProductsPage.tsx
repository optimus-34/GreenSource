import React, { useEffect, useState } from "react";
import { IProduct } from "../types/Product";
import { getProducts } from "../utils/services";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";
import { Frown } from "lucide-react";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useSelector(selectAuth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(token || "");
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
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-10 h-96">
            <Frown className="size-20 text-gray-600" />
            <span>
              No Products available as of now. Please try again later.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
