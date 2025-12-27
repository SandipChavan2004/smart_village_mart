import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import api from "../../lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  shop_name: string;
  category: string;
}

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/category/${category}`)
      .then((res) => setProducts(res.data))
      .catch(() => alert("Failed to load category products"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-6 capitalize">
          {category?.replace("-", " ")} Products
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`}>
                <Card className="hover:shadow-lg transition">
                  <img
                    src={
                      p.image
                        ? `http://localhost:5000${p.image}`
                        : "https://via.placeholder.com/300"
                    }
                    className="h-48 w-full object-cover"
                  />
                  <CardContent className="p-4">
                    <h3>{p.name}</h3>
                    <p className="text-sm text-gray-500">
                      {p.shop_name}
                    </p>
                    <p className="text-emerald-600 font-semibold">
                      ₹{p.price}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}