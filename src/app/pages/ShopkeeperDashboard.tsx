import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
}

/* ================= CONSTANTS ================= */
const CATEGORIES = [
  'Groceries',
  'Electronics',
  'Agricultural',
  'Home & Kitchen',
  'Fashion',
  'Health & Beauty',
];

export default function ShopkeeperDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null as File | null,
  });

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async () => {
    if (!user) return;
    const res = await api.get(`/products/shopkeeper/${user.id}`);
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Unauthorized');

    const formData = new FormData();
    formData.append('shopkeeper_id', String(user.id));
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('category', form.category);
    if (form.image) formData.append('image', form.image);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        alert('Product updated');
      } else {
        await api.post('/products/add', formData);
        alert('Product added');
      }

      resetForm();
      loadProducts();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Operation failed';
      alert(errorMessage);

      // If verification error, reload to show status
      if (err.response?.status === 403) {
        window.location.reload();
      }
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      category: p.category,
      image: null,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Verification Status Banner */}
      {user?.verification_status === 'pending' && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-yellow-800">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">
                Your account is pending admin verification. You cannot add products until approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {user?.verification_status === 'rejected' && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="container mx-auto px-4 py-3">
            <div className="text-red-800">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">
                  Your account verification was rejected.
                </p>
              </div>
              {user.rejection_reason && (
                <p className="text-sm ml-7">
                  Reason: {user.rejection_reason}
                </p>
              )}
              <p className="text-sm ml-7 mt-1">
                Please contact support for assistance.
              </p>
            </div>
          </div>
        </div>
      )}

      {user?.verification_status === 'approved' && (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center space-x-2 text-emerald-800">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">
                ✓ Verified Account
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopkeeper Dashboard</h1>

          <a
            href="/shopkeeper/analytics"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Analytics
          </a>
        </div>

        {/* ================= ADD / EDIT FORM ================= */}
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl mb-4">
            {editingId ? 'Edit Product' : 'Add Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border p-2 rounded"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                required
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                required
              />
            </div>

            <select
              className="w-full border p-2 rounded"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files?.[0] || null,
                })
              }
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border px-6 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= PRODUCT LIST ================= */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">My Products</h2>

          {products.length === 0 ? (
            <p className="text-gray-500">No products added yet</p>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center border p-4 rounded"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        p.image
                          ? `http://localhost:5000${p.image}`
                          : 'https://via.placeholder.com/80'
                      }
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        {p.category} | Stock: {p.stock}
                      </p>
                      <p className="text-emerald-600 font-semibold">
                        ₹{p.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="border px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}