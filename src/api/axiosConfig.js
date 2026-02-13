import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.PROD 
  ? 'https://api.abkdiamond.com/api' 
  : '/api'; 

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. İSTEK (REQUEST) INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // v2 isteklerine ve refresh isteğine token ekleme
    if (token && !config.url.includes('/auth/refresh') && !config.url.includes('/v2')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. YANIT (RESPONSE) INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // DÜZELTME BURADA: Sadece 401 (Unauthorized) ise token yenile. 
    // 403 (Forbidden) yetki hatasıdır, döngüye girmemeli.
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/v2')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await api.post('/v1/auth/refresh');
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Oturum yenilenemedi:", refreshError);
        localStorage.removeItem('token');
        window.dispatchEvent(new Event("auth-change")); 
        toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;