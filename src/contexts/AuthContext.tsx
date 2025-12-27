import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { authAPI } from '../lib/api.ts';

/* ================= TYPES ================= */

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'shopkeeper' | 'admin';
  phone?: string;
  address?: string;
  shop_name?: string;
  category?: string;
  verification_status?: string;
  rejection_reason?: string;
  gstin?: string;
  pan?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (
    email: string,
    password: string,
    role: 'customer' | 'shopkeeper'
  ) => Promise<void>;
  register: (
    data: any,
    role: 'customer' | 'shopkeeper'
  ) => Promise<void>;
  logout: () => void;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= CHECK LOGIN ON RELOAD ================= */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole') as
        | 'customer'
        | 'shopkeeper'
        | null;

      if (!token || !role) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getProfile();
        setUser({ ...res.data, role });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (
    email: string,
    password: string,
    role: 'customer' | 'shopkeeper'
  ) => {
    try {
      const res =
        role === 'customer'
          ? await authAPI.loginCustomer({ email, password })
          : await authAPI.loginShopkeeper({ email, password });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);

      setUser({ ...user, role });
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || 'Login failed'
      );
    }
  };

  /* ================= REGISTER ================= */
  const register = async (
    data: any,
    role: 'customer' | 'shopkeeper'
  ) => {
    try {
      const res =
        role === 'customer'
          ? await authAPI.registerCustomer(data)
          : await authAPI.registerShopkeeper(data);

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);

      setUser({ ...user, role });
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || 'Registration failed'
      );
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  /* ================= PROVIDER VALUE ================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};