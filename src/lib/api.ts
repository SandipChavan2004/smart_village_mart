import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔐 AUTH APIS
export const authAPI = {
  // CUSTOMER
  registerCustomer: (data: any) => api.post('/customer/register', data),
  loginCustomer: (data: any) => api.post('/customer/login', data),

  // SHOPKEEPER
  registerShopkeeper: (data: any) => api.post('/shopkeeper/register', data),
  loginShopkeeper: (data: any) => api.post('/shopkeeper/login', data),

  // PROFILE
  getProfile: () => api.get('/auth/profile'),
};

export default api;