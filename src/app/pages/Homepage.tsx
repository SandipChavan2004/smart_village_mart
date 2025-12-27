import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEOHead from "../components/SEOHead";
import {
  Store,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import api from "../../lib/api";

/* ================== DATA ================== */

const categories = [
  { name: "Groceries", slug: "groceries", icon: "🛒", color: "bg-emerald-100" },
  { name: "Electronics", slug: "electronics", icon: "📱", color: "bg-blue-100" },
  { name: "Agricultural", slug: "agricultural", icon: "🌾", color: "bg-yellow-100" },
  { name: "Home & Kitchen", slug: "home_kitchen", icon: "🏠", color: "bg-purple-100" },
  { name: "Fashion", slug: "fashion", icon: "👕", color: "bg-pink-100" },
  { name: "Health & Beauty", slug: "health_beauty", icon: "💄", color: "bg-red-100" },
  { name: "Sports", slug: "sports", icon: "⚽", color: "bg-orange-100" },
  { name: "Books", slug: "books", icon: "📚", color: "bg-indigo-100" },
];

/* ================== TYPES ================== */
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string | null;
  shop_name: string;
}

const stats = [
  {
    icon: Store,
    value: "500+",
    label: "Local Shops",
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },
  {
    icon: ShoppingBag,
    value: "10K+",
    label: "Products",
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  {
    icon: Users,
    value: "5K+",
    label: "Customers",
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Satisfaction",
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
];

/* ================== COMPONENT ================== */

export default function Homepage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        // Get first 4 products for featured section
        setProducts(res.data.slice(0, 4));
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Smart Village Mart",
    "description": "Platform connecting local village shopkeepers with customers across India",
    "url": "https://smartvillagemart.com",
    "logo": "/logo/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "5000"
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead
        title="Home"
        description="Smart Village Mart connects local shopkeepers with customers. Buy fresh groceries and authentic village products online. Supporting rural businesses across India."
        keywords="village mart, local products, groceries online, rural shopping, local shopkeepers, fresh produce, village products, India, authentic products"
        structuredData={structuredData}
      />
      <Header />

      {/* ================= HERO (VIDEO BG) ================= */}
      <section className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] overflow-hidden text-white">

        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark Overlay (IMPORTANT for readability) */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 sm:mb-6">
              Empowering Rural Businesses Through Digital Connectivity
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-10 leading-relaxed">
              Discover local village shops, explore authentic products, and compare prices —
              all in one place. Smart Village Mart bridges the gap between villagers and
              shopkeepers through simple, transparent digital access.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-emerald-700 hover:bg-gray-100 px-6 sm:px-8 w-full sm:w-auto"
              >
                <Link to="/products">
                  Find Products Near Me <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-emerald-700 px-6 sm:px-8 w-full sm:w-auto transition-all"
              >
                <Link to="/shopkeeper-login">Join as Shopkeeper</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* ================= STATS ================= */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 text-center">
          {stats.map((item, i) => (
            <div key={i}>
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${item.bg}`}
              >
                <item.icon className={`h-7 w-7 ${item.text}`} />
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold">{item.value}</h3>
              <p className="text-sm sm:text-base text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="bg-gray-50 py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-12 md:mb-14">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/category/${cat.slug}`}>
                <Card className="rounded-xl sm:rounded-2xl border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition">
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                    <div
                      className={`${cat.color} w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl`}
                    >
                      {cat.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-medium">{cat.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-8 sm:mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Featured Products</h2>
            <Button asChild variant="ghost">
              <Link to="/products">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available yet</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <Card className="rounded-2xl overflow-hidden border-none shadow-sm hover:shadow-lg transition">
                    <img
                      src={
                        p.image
                          ? `http://localhost:5000${p.image}`
                          : "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"
                      }
                      alt={p.name}
                      className="h-56 w-full object-cover hover:scale-105 transition"
                    />
                    <CardContent className="p-5">
                      <h3 className="font-medium mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.shop_name}</p>
                      <p className="text-lg font-semibold text-emerald-600 mt-2">
                        ₹{p.price}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="bg-emerald-50 py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-14 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6">
              About Smart Village Mart
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
              We empower village shopkeepers by bringing them online while
              customers enjoy authentic local products.
            </p>

            <Button asChild size="lg" className="rounded-full px-6 sm:px-8 w-full sm:w-auto">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 md:mt-0">
            <img
              src="/logo/logo.png"
              alt="Village shop showcasing local products"
              className="rounded-xl sm:rounded-2xl shadow-md w-full h-auto"
            />
            <img
              src="https://www.antarnaad.net/app/docs/20240314121138650.jpg"
              alt="Fresh local products from village markets"
              className="rounded-xl sm:rounded-2xl shadow-md mt-6 sm:mt-8 w-full h-auto"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}