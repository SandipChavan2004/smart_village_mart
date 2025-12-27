import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Store, MapPin, Phone, Mail } from 'lucide-react';
import api from '../../lib/api';

/* ================= TYPES ================= */
interface Shop {
  id: number;
  shop_name: string;
  name: string;
  category: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

export default function ShopPage() {
  const { id } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ================= LOAD SHOP AND PRODUCTS ================= */
  useEffect(() => {
    const loadShopData = async () => {
      try {
        // Fetch shop details
        const shopRes = await api.get(`/shopkeeper/${id}`);
        setShop(shopRes.data);

        // Fetch products from this shop
        const productsRes = await api.get(`/products/shopkeeper/${id}`);
        setProducts(productsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load shop');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadShopData();
    }
  }, [id]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {error || 'Shop not found'}
            </h2>
            <Link to="/products" className="text-emerald-600 hover:underline">
              ← Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ================= SHOP DISPLAY ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Shop Header */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
              <Store className="h-12 w-12 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl mb-2">{shop.shop_name}</h1>
              <div className="flex items-center space-x-1 mb-4">
                <span className="text-gray-500">{shop.category}</span>
              </div>
              <p className="text-gray-700 mb-4">
                Owner: {shop.name}
              </p>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {shop.address && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                    {shop.address}
                  </div>
                )}
                {shop.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                    {shop.phone}
                  </div>
                )}
                {shop.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-emerald-600" />
                    {shop.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shop Products */}
        <div>
          <h2 className="text-2xl mb-6">Products from this shop</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              No products available from this shop yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={
                          product.image
                            ? `http://localhost:5000${product.image}`
                            : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 group-hover:text-emerald-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-xl text-emerald-600">₹{product.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
