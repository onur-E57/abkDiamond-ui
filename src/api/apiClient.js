{/*
import axios from 'axios';

// import.meta.env.PROD -> Vite'in sunduğu "Şu an canlıda mıyız?" kontrolüdür.
const baseURL = import.meta.env.PROD 
  ? 'https://api.abkdiamond.com'    // Canlı Site:
  : '/api/v1';                             // LOCALHOST:

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
*/}