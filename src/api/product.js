import api from './axiosConfig';

// ==============================
// 🛍️ MÜŞTERİ TARAFI (PUBLIC - v2)
// ==============================

// Vitrin ve Koleksiyon Listesi
export const getProducts = async (params = {}) => {
  const response = await api.post('/v2/product/filter', { 
    ...params 
  });
  return response.data;
};

// Filtreleme
export const getFilteredProducts = async (filters) => {
  const response = await api.post('/v2/product/filter', filters);
  return response.data;
};

// Ürün Detayı (Backend 'productId' bekliyor)
export const getProductById = async (id) => {
  const response = await api.get('/v2/product/search-by-id', { 
    params: { productId: id } 
  });
  return response.data;
};

export const getStoreCategories = async () => {
    const response = await api.get('/v2/category'); 
    return response.data;
};
// ==============================
// 🔧 ADMIN TARAFI (PRIVATE - v1)
// ==============================

// 1. Admin Ürün Listesi
export const getAdminProducts = async () => {
  const response = await api.get('/v1/product');
  return response.data;
};

// 2. Kategorileri Getir (Admin Paneli İçin)
export const getCategories = async () => {
    const response = await api.get('/v1/category'); 
    return response.data;
};

// 3. Kategori Ekle
export const createCategory = async (categoryData) => {
  const response = await api.post('/v1/category', categoryData); 
  return response.data;
};

// 4. Ürün Ekle
export const addProduct = async (productData) => {
  const response = await api.post('/v1/product', productData);
  return response.data;
};

// 5. Ürün Sil
export const deleteProduct = async (id) => {
  const response = await api.delete(`/v1/product`, {
    params: { productId: id } 
  });
  return response.data;
};

// 6. Ürün Güncelle (YENİ)
export const updateProduct = async (productData) => {
  const response = await api.put('/v1/product', productData);
  return response.data;
};