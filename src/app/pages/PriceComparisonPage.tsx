import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, TrendingDown, TrendingUp, Store, MapPin, Phone } from 'lucide-react';
import api from '../../lib/api';

interface ProductComparison {
    id: number;
    name: string;
    category: string;
    shops: {
        shop_id: number;
        shop_name: string;
        shop_address: string;
        shop_phone: string;
        price: number;
        stock: number;
        image: string | null;
    }[];
    lowestPrice: number;
    highestPrice: number;
    priceDifference: number;
    savingsPercentage: number;
}

export default function PriceComparisonPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [comparisons, setComparisons] = useState<ProductComparison[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hasSearched, setHasSearched] = useState(false);
    const [allCategories, setAllCategories] = useState<string[]>(['all']);

    // Fetch all categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/products/compare');
                const uniqueCategories = ['all', ...new Set(response.data.map((p: any) => p.category))];
                setAllCategories(uniqueCategories as string[]);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Don't fetch on mount - only when user searches or selects category
    const fetchPriceComparisons = async (query: string, category: string) => {
        // If no search query and category is 'all', don't search
        if ((!query || query.trim().length < 2) && category === 'all') {
            setComparisons([]);
            setHasSearched(false);
            return;
        }

        try {
            setLoading(true);
            setHasSearched(true);
            const response = await api.get('/products/compare');

            // Filter products by search query and category
            const filtered = response.data.filter((product: any) => {
                const matchesSearch = !query || query.trim().length < 2 ||
                    product.name.toLowerCase().includes(query.toLowerCase());
                const matchesCategory = category === 'all' || product.category === category;
                return matchesSearch && matchesCategory;
            });

            // Group products by name and calculate price differences
            const grouped = groupProductsByName(filtered);
            setComparisons(grouped);
        } catch (error) {
            console.error('Failed to fetch price comparisons:', error);
            setComparisons([]);
        } finally {
            setLoading(false);
        }
    };

    // Search when user types (debounced) or changes category
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPriceComparisons(searchQuery, selectedCategory);
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    const groupProductsByName = (products: any[]): ProductComparison[] => {
        const grouped: { [key: string]: any } = {};

        products.forEach((product) => {
            const key = product.name.toLowerCase().trim();

            if (!grouped[key]) {
                grouped[key] = {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    shops: [],
                };
            }

            grouped[key].shops.push({
                shop_id: product.shop_id,
                shop_name: product.shop_name,
                shop_address: product.shop_address || 'Address not available',
                shop_phone: product.shop_phone || 'N/A',
                price: parseFloat(product.price),
                stock: product.stock,
                image: product.image,
            });
        });

        // Calculate price statistics and filter products with multiple shops
        return Object.values(grouped)
            .filter((item) => item.shops.length > 1)
            .map((item) => {
                const prices = item.shops.map((shop: any) => shop.price);
                const lowestPrice = Math.min(...prices);
                const highestPrice = Math.max(...prices);
                const priceDifference = highestPrice - lowestPrice;
                const savingsPercentage = ((priceDifference / highestPrice) * 100).toFixed(1);

                // Sort shops by price (lowest first)
                item.shops.sort((a: any, b: any) => a.price - b.price);

                return {
                    ...item,
                    lowestPrice,
                    highestPrice,
                    priceDifference,
                    savingsPercentage: parseFloat(savingsPercentage),
                };
            })
            .sort((a, b) => b.savingsPercentage - a.savingsPercentage); // Sort by highest savings
    };

    const filteredComparisons = comparisons.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(comparisons.map((item) => item.category))];

    return (
        <div className="min-h-screen bg-gray-50">
            <SEOHead
                title="Price Comparison"
                description="Compare prices of products across different village shops. Find the best deals and save money on your purchases."
                keywords="price comparison, best deals, compare prices, save money, village shops"
            />
            <Header />

            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
                        Price Comparison
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Compare prices across different shops and find the best deals in your area
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-6 sm:mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {allCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Searching for products...</p>
                    </div>
                ) : !hasSearched ? (
                    <div className="text-center py-20">
                        <div className="bg-emerald-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Search className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            Search for Products to Compare
                        </h3>
                        <p className="text-gray-600 text-lg mb-2">
                            Enter a product name in the search box above to compare prices
                        </p>
                        <p className="text-gray-500 text-sm">
                            Example: Try searching for "Rice", "Oil", "Wheat", etc.
                        </p>
                    </div>
                ) : comparisons.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No price comparisons found{searchQuery && ` for "${searchQuery}"`}{selectedCategory !== 'all' && ` in ${selectedCategory}`}</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Try searching for a different product or selecting a different category
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comparisons.map((comparison) => (
                            <Card key={comparison.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    {/* Product Header */}
                                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 sm:p-6 border-b">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                                    {comparison.name}
                                                </h2>
                                                <p className="text-sm text-gray-600">
                                                    Category: <span className="font-medium">{comparison.category}</span>
                                                </p>
                                            </div>

                                            <div className="flex flex-col sm:items-end gap-2">
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <TrendingDown className="h-5 w-5" />
                                                    <span className="text-lg font-semibold">
                                                        Save up to {comparison.savingsPercentage}%
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Price difference: ₹{comparison.priceDifference.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shop Comparisons */}
                                    <div className="p-4 sm:p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {comparison.shops.map((shop, index) => (
                                                <div
                                                    key={shop.shop_id}
                                                    className={`relative p-4 rounded-xl border-2 transition-all ${index === 0
                                                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                                                        : 'border-gray-200 hover:border-emerald-200 hover:shadow-sm'
                                                        }`}
                                                >
                                                    {/* Best Price Badge */}
                                                    {index === 0 && (
                                                        <div className="absolute -top-3 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                                            Best Price
                                                        </div>
                                                    )}

                                                    {/* Product Image */}
                                                    {shop.image && (
                                                        <img
                                                            src={shop.image.startsWith('http') ? shop.image : `http://localhost:5000${shop.image}`}
                                                            alt={comparison.name}
                                                            className="w-full h-32 object-cover rounded-lg mb-3"
                                                        />
                                                    )}

                                                    {/* Shop Info */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <Store className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">{shop.shop_name}</h3>
                                                                <Link
                                                                    to={`/shop/${shop.shop_id}`}
                                                                    className="text-xs text-emerald-600 hover:underline"
                                                                >
                                                                    View Shop
                                                                </Link>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                            <p className="line-clamp-2">{shop.shop_address}</p>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone className="h-4 w-4 flex-shrink-0" />
                                                            <p>{shop.shop_phone}</p>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="pt-3 border-t">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-2xl font-bold text-emerald-600">
                                                                    ₹{shop.price.toFixed(2)}
                                                                </span>
                                                                {index > 0 && (
                                                                    <div className="flex items-center gap-1 text-red-600 text-sm">
                                                                        <TrendingUp className="h-4 w-4" />
                                                                        <span>+₹{(shop.price - comparison.lowestPrice).toFixed(2)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Stock: {shop.stock > 0 ? `${shop.stock} available` : 'Out of stock'}
                                                            </p>
                                                        </div>

                                                        {/* Action Button */}
                                                        <Button
                                                            asChild
                                                            className="w-full mt-3"
                                                            variant={index === 0 ? 'default' : 'outline'}
                                                            disabled={shop.stock === 0}
                                                        >
                                                            <Link to={`/shop/${shop.shop_id}`}>
                                                                {shop.stock > 0 ? 'Visit Shop' : 'Out of Stock'}
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-3 text-blue-900">How Price Comparison Works</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>We compare prices of the same product across different village shops</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>The "Best Price" badge shows the shop with the lowest price</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Savings percentage shows how much you can save by choosing the best price</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>All prices are updated in real-time from our partner shops</span>
                        </li>
                    </ul>
                </div>
            </div>

            <Footer />
        </div>
    );
}
