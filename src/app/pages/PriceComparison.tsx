import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../../lib/api";

interface CompareProduct {
  id: number;
  name: string;
  price: number;
  shop_name: string;
  address: string;
}

export default function PriceComparison() {
  const { name } = useParams();
  const [products, setProducts] = useState<CompareProduct[]>([]);

  useEffect(() => {
    api
      .get(`/products/compare/${name}`)
      .then((res) => setProducts(res.data))
      .catch(() => alert("Failed to load comparison"));
  }, [name]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl mb-6">
          Price Comparison for "{name}"
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-500">No data found</p>
        ) : (
          <div className="space-y-4">
            {products.map((p, index) => (
              <div
                key={p.id}
                className={`p-4 border rounded flex justify-between ${
                  index === 0
                    ? "border-emerald-500 bg-emerald-50"
                    : ""
                }`}
              >
                <div>
                  <p className="font-medium">{p.shop_name}</p>
                  <p className="text-sm text-gray-500">{p.address}</p>
                </div>
                <p className="font-bold text-lg">₹{p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
