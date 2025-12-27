import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { ShieldCheck, Store, Mail, Phone, MapPin, FileText, LogOut } from 'lucide-react';
import api from '../../lib/api';

interface Shopkeeper {
    id: number;
    name: string;
    email: string;
    phone: string;
    shop_name: string;
    address: string;
    category: string;
    gstin: string;
    pan: string;
    license_number: string;
    verification_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    rejection_reason?: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedShopkeeper, setSelectedShopkeeper] = useState<number | null>(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin-login');
            return;
        }
        loadShopkeepers();
    }, [user, navigate, activeTab]);

    const loadShopkeepers = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'pending'
                ? '/admin/shopkeepers/pending'
                : `/admin/shopkeepers/all?status=${activeTab}`;

            const res = await api.get(endpoint);
            setShopkeepers(res.data);
        } catch (err) {
            console.error('Failed to load shopkeepers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await api.put(`/admin/shopkeepers/${id}/approve`);
            alert('Shopkeeper approved successfully!');
            loadShopkeepers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to approve shopkeeper');
        }
    };

    const handleReject = async (id: number) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            await api.put(`/admin/shopkeepers/${id}/reject`, { reason: rejectionReason });
            alert('Shopkeeper rejected');
            setRejectionReason('');
            setSelectedShopkeeper(null);
            loadShopkeepers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to reject shopkeeper');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex space-x-2 mb-6">
                    {(['pending', 'approved', 'rejected'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === tab
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Shopkeepers List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : shopkeepers.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-gray-500">
                            No {activeTab} shopkeepers found
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {shopkeepers.map((shopkeeper) => (
                            <Card key={shopkeeper.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <Store className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{shopkeeper.shop_name}</CardTitle>
                                                <p className="text-sm text-gray-500">Owner: {shopkeeper.name}</p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                shopkeeper.verification_status === 'approved'
                                                    ? 'default'
                                                    : shopkeeper.verification_status === 'rejected'
                                                        ? 'destructive'
                                                        : 'secondary'
                                            }
                                        >
                                            {shopkeeper.verification_status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Contact Info */}
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Mail className="h-4 w-4" />
                                            <span>{shopkeeper.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span>{shopkeeper.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>{shopkeeper.address}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <FileText className="h-4 w-4" />
                                            <span>{shopkeeper.category}</span>
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">Documents</h4>
                                        <div className="grid md:grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">GSTIN:</span>
                                                <p className="font-mono">{shopkeeper.gstin}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">PAN:</span>
                                                <p className="font-mono">{shopkeeper.pan}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">License:</span>
                                                <p className="font-mono">{shopkeeper.license_number}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rejection Reason */}
                                    {shopkeeper.rejection_reason && (
                                        <div className="bg-red-50 border border-red-200 p-3 rounded">
                                            <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                                            <p className="text-sm text-red-700">{shopkeeper.rejection_reason}</p>
                                        </div>
                                    )}

                                    {/* Actions for Pending */}
                                    {shopkeeper.verification_status === 'pending' && (
                                        <div className="flex space-x-3 pt-2">
                                            <Button
                                                onClick={() => handleApprove(shopkeeper.id)}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => setSelectedShopkeeper(shopkeeper.id)}
                                                variant="destructive"
                                                className="flex-1"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    {/* Rejection Form */}
                                    {selectedShopkeeper === shopkeeper.id && (
                                        <div className="space-y-3 pt-2 border-t">
                                            <Textarea
                                                placeholder="Enter rejection reason..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                rows={3}
                                            />
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => handleReject(shopkeeper.id)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Confirm Rejection
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedShopkeeper(null);
                                                        setRejectionReason('');
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
