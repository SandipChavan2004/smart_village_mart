import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Store, MapPin, Phone, Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

/* ================= TYPES ================= */
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string | null;
  shopkeeper_id: number;
  shop_name: string;
  address?: string;
  phone?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  /* ================= CHECK SUBSCRIPTION STATUS ================= */
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user || user.role !== 'customer' || !product || product.stock > 0) {
        return;
      }

      setCheckingSubscription(true);
      try {
        const res = await api.get(`/notifications/subscription/${product.id}?customer_id=${user.id}`);
        setIsSubscribed(res.data.subscribed);
      } catch (err) {
        console.error('Failed to check subscription:', err);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [user, product]);

  /* ================= HANDLE NOTIFY ME ================= */
  const handleNotifyMe = async () => {
    if (!user || !product) return;

    setSubscribing(true);
    try {
      if (isSubscribed) {
        await api.delete(`/notifications/unsubscribe/${product.id}`, {
          data: { customer_id: user.id }
        });
        setIsSubscribed(false);
        toast.success('Unsubscribed from notifications');
      } else {
        await api.post('/notifications/subscribe', {
          product_id: product.id,
          customer_id: user.id
        });
        setIsSubscribed(true);
        toast.success("You'll be notified when this product is back in stock!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update subscription');
    } finally {
      setSubscribing(false);
    }
  };

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
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {error || 'Product not found'}
            </h2>
            <Link
              to="/products"
              className="text-emerald-600 hover:underline"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ================= PRODUCT DISPLAY ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-white">
            <img
              src={
                product.image
                  ? `http://localhost:5000${product.image}`
                  : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl mb-4">{product.name}</h1>

            <p className="text-3xl text-emerald-600 mb-4">
              ₹{product.price}
            </p>

            <p className="text-gray-700 mb-6">
              {product.description || 'No description available'}
            </p>

            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Availability:</strong>{' '}
                {product.stock > 0
                  ? `${product.stock} units available`
                  : 'Out of stock'}
              </p>
            </div>

            {/* Shop Info Card */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-medium">
                  Available At
                </h3>

                <div className="flex items-center space-x-2 text-emerald-600">
                  <Store className="h-4 w-4" />
                  <Link
                    to={`/shop/${product.shopkeeper_id}`}
                    className="hover:underline"
                  >
                    {product.shop_name}
                  </Link>
                </div>

                {product.address && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{product.address}</span>
                  </div>
                )}

                {product.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{product.phone}</span>
                  </div>
                )}

                <p className="text-sm text-gray-600">
                  Stock:{' '}
                  <span
                    className={
                      product.stock > 0 ? 'text-emerald-600' : 'text-red-600'
                    }
                  >
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </p>

                {/* Notify Me Button for Out of Stock Products */}
                {product.stock === 0 && user?.role === 'customer' && (
                  <div className="mt-4">
                    <Button
                      onClick={handleNotifyMe}
                      disabled={subscribing || checkingSubscription}
                      variant={isSubscribed ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {subscribing ? (
                        'Processing...'
                      ) : isSubscribed ? (
                        <>
                          <BellOff className="h-4 w-4 mr-2" />
                          Unsubscribe from Notifications
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4 mr-2" />
                          Notify Me When Available
                        </>
                      )}
                    </Button>
                    {isSubscribed && (
                      <p className="text-sm text-emerald-600 mt-2 text-center">
                        ✓ You'll be notified when this product is back in stock
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="text-sm text-gray-500 mt-4">
              * Please visit the shop or contact the shopkeeper to purchase.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}