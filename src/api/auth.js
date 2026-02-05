import api from './axiosConfig';

// GİRİŞ YAPMA
export const login = async (credentials) => {
  const response = await api.post('/v1/auth/login', credentials);
  return response.data;
};

// KAYIT OLMA
export const register = async (userData) => {
  const response = await api.post('/v1/users', userData);
  return response.data;
};