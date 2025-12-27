import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import RevenueChart from '../components/analytics/RevenueChart';
import ProductPerformanceTable from '../components/analytics/ProductPerformanceTable';

interface AnalyticsOverview {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalViews: number;
    avgOrderValue: number;
    revenueGrowth: number;
    ordersGrowth: number;
}

interface RevenueTrend {
    date: string;
    revenue: number;
    orders: number;
}

interface TopProduct {
    id: number;
    name: string;
    category: string;
    image: string | null;
    stock: number;
    units_sold: number;
    revenue: number;
    order_count: number;
    views: number;
}

interface CategoryData {
    category: string;
    product_count: number;
    units_sold: number;
    revenue: number;
}

export default function ShopkeeperAnalytics() {
    const { user } = useAuth();
    const [period, setPeriod] = useState('30');
    const [loading, setLoading] = useState(true);

    const [overview, setOverview] = useState<AnalyticsOverview>({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalViews: 0,
        avgOrderValue: 0,
        revenueGrowth: 0,
        ordersGrowth: 0
    });

    const [revenueTrends, setRevenueTrends] = useState<RevenueTrend[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        if (user) {
            loadAnalytics();
        }
    }, [user, period]);

    const loadAnalytics = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const [overviewRes, trendsRes, productsRes, categoriesRes] = await Promise.all([
                api.get(`/analytics/shopkeeper/${user.id}/overview?period=${period}`),
                api.get(`/analytics/shopkeeper/${user.id}/revenue-trends?period=${period}`),
                api.get(`/analytics/shopkeeper/${user.id}/top-products?period=${period}&limit=10`),
                api.get(`/analytics/shopkeeper/${user.id}/category-breakdown?period=${period}`)
            ]);

            setOverview(overviewRes.data);
            setRevenueTrends(trendsRes.data);
            setTopProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const periodOptions = [
        { value: '7', label: 'Last 7 Days' },
        { value: '30', label: 'Last 30 Days' },
        { value: '90', label: 'Last 90 Days' },
        { value: 'all', label: 'All Time' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1">Track your business performance and insights</p>
                    </div>

                    {/* Period Filter */}
                    <div className="mt-4 md:mt-0">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            {periodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <AnalyticsCard
                        title="Total Revenue"
                        value={overview.totalRevenue}
                        prefix="₹"
                        icon={
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        trend={overview.revenueGrowth}
                        trendLabel="vs previous period"
                    />

                    <AnalyticsCard
                        title="Total Orders"
                        value={overview.totalOrders}
                        icon={
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        }
                        trend={overview.ordersGrowth}
                        trendLabel="vs previous period"
                    />

                    <AnalyticsCard
                        title="Product Views"
                        value={overview.totalViews}
                        icon={
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        }
                    />

                    <AnalyticsCard
                        title="Avg Order Value"
                        value={overview.avgOrderValue}
                        prefix="₹"
                        icon={
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                </div>

                {/* Revenue Chart */}
                <div className="mb-8">
                    <RevenueChart data={revenueTrends} />
                </div>

                {/* Category Breakdown */}
                {categories.length > 0 && (
                    <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <div key={cat.category} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                                    <h4 className="font-medium text-gray-900 mb-2">{cat.category}</h4>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-gray-600">
                                            Products: <span className="font-medium text-gray-900">{cat.product_count}</span>
                                        </p>
                                        <p className="text-gray-600">
                                            Units Sold: <span className="font-medium text-gray-900">{cat.units_sold}</span>
                                        </p>
                                        <p className="text-gray-600">
                                            Revenue: <span className="font-medium text-emerald-600">₹{cat.revenue.toLocaleString()}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Performance Table */}
                <ProductPerformanceTable products={topProducts} />
            </div>

            <Footer />
        </div>
    );
}
