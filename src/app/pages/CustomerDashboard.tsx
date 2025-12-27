import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Store,
  MapPin,
  ShoppingBag,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

interface Shop {
  id: number;
  shop_name: string;
  category: string;
  address: string;
}

interface Product {
  id: number;
  category: string;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products to get count and categories
        const productsRes = await api.get("/products");
        setProducts(productsRes.data);

        // For shops, we'll fetch from a shopkeepers endpoint
        // Since we don't have a public shopkeepers endpoint, we'll derive from products
        const uniqueShops = new Map<number, Shop>();

        // We need to create a shopkeepers endpoint or get shops from products
        // For now, let's just show product stats
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from products
  const productCount = products.length;
  const categories = [...new Set(products.map(p => p.category))];
  const categoryCount = categories.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-10 space-y-8">

        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardContent className="p-6">
            <h1 className="text-3xl font-semibold mb-2">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-emerald-100">
              Discover nearby village shops and compare product prices easily
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <Store className="h-10 w-10 text-emerald-600" />
              <div>
                <p className="text-2xl font-semibold">
                  {loading ? "..." : shops.length || "0"}
                </p>
                <p className="text-gray-600 text-sm">
                  Registered Shops
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <ShoppingBag className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-2xl font-semibold">
                  {loading ? "..." : productCount}
                </p>
                <p className="text-gray-600 text-sm">
                  Products Listed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <Layers className="h-10 w-10 text-purple-600" />
              <div>
                <p className="text-2xl font-semibold">
                  {loading ? "..." : categoryCount}
                </p>
                <p className="text-gray-600 text-sm">
                  Product Categories
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Browse Products */}
        <Card>
          <CardHeader>
            <CardTitle>Explore Products</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Browse products from verified village shops in your area
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild size="lg" className="w-full">
                <Link to="/products">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  View All Products
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full">
                <Link to="/products">
                  <Layers className="h-5 w-5 mr-2" />
                  Browse by Category
                </Link>
              </Button>
            </div>

            {!loading && categories.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Available Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category}`}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm hover:bg-emerald-100 transition"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
