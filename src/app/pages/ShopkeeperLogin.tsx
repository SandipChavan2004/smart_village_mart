import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Store } from 'lucide-react';

const categories = [
  'groceries',
  'electronics',
  'agricultural',
  'home_kitchen',
  'fashion',
  'health_beauty',
  'sports',
  'books',
  'toys',
  'stationery',
];

export default function ShopkeeperLogin() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shop_name: '',
    address: '',
    gstin: '',
    pan: '',
    license_number: '',
    category: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData.email, loginData.password, 'shopkeeper');
      toast.success('Login successful!');
      navigate('/shopkeeper/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(registerData, 'shopkeeper');
      toast.success('Registration successful! Your account is pending verification.');
      navigate('/shopkeeper/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <Store className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl mb-2">Shopkeeper Portal</h1>
            <p className="text-gray-600">Join our platform and grow your business</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seller Account</CardTitle>
              <CardDescription>Login or register as a shopkeeper</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="shop@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="register-name">Your Name</Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="John Doe"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="register-shop-name">Shop Name</Label>
                        <Input
                          id="register-shop-name"
                          type="text"
                          placeholder="My Village Shop"
                          value={registerData.shop_name}
                          onChange={(e) => setRegisterData({ ...registerData, shop_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="shop@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="register-phone">Phone</Label>
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="+91 1234567890"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="register-category">Category</Label>
                        <Select
                          value={registerData.category}
                          onValueChange={(value) => setRegisterData({ ...registerData, category: value })}
                        >
                          <SelectTrigger id="register-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-address">Shop Address</Label>
                      <Input
                        id="register-address"
                        type="text"
                        placeholder="Shop address"
                        value={registerData.address}
                        onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="register-gstin">GSTIN (Optional)</Label>
                        <Input
                          id="register-gstin"
                          type="text"
                          placeholder="GSTIN"
                          value={registerData.gstin}
                          onChange={(e) => setRegisterData({ ...registerData, gstin: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="register-pan">PAN (Optional)</Label>
                        <Input
                          id="register-pan"
                          type="text"
                          placeholder="PAN"
                          value={registerData.pan}
                          onChange={(e) => setRegisterData({ ...registerData, pan: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="register-license">License No.</Label>
                        <Input
                          id="register-license"
                          type="text"
                          placeholder="License"
                          value={registerData.license_number}
                          onChange={(e) => setRegisterData({ ...registerData, license_number: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Register Shop'}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      Your account will be verified before you can start selling
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Are you a customer?{' '}
              <Link to="/customer-login" className="text-emerald-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
