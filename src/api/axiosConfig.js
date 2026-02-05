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
// Giden her isteğe, varsa Access Token'ı ekler.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
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

    // Hata 401/403 ise VE daha önce denenmemişse
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      
      // EĞER HATA ALAN URL '/v2' İSE VEYA '/refresh' İSE -> TOKEN YENİLEME, DİREKT HATAYI DÖN.
      // Mantık: Public (v2) sayfada 403 alıyorsan bu "Token süresi bitti" demek değildir. "Giremezsin" demektir.
      if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/v2')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // ... (v1 private istekler için token yenileme mantığı aynı kalıyor) ...
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