// src/api/product.js
import api from './axiosConfig';
import { mockProducts, mockCategories } from './mockData';

// ⚠️ MOCK MODU: True yaparsan sahte veri çalışır, False yaparsan gerçek backend'e gider.
// Vercel deployment'ı için şimdilik TRUE yapıyoruz.
const USE_MOCK = true;

// ==============================
// 🛍️ MÜŞTERİ TARAFI
// ==============================

// Vitrin ve Koleksiyon Listesi
export const getProducts = async (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockProducts), 500); // 0.5sn gecikme efekti
    });
  }
  const response = await api.post('/v2/product/filter', { ...params });
  return response.data;
};

// Filtreleme (Mock destekli)
export const getFilteredProducts = async (filters = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...mockProducts];

            // Basit Mock Filtreleme Mantığı
            if (filters.categoryId) {
                filtered = filtered.filter(p => p.categoryId === filters.categoryId);
            }
            if (filters.name) {
                filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.name.toLowerCase()));
            }
            // Sayfalama simülasyonu (Pagination)
            const page = filters.page || 0;
            const size = filters.size || 12;
            const start = page * size;
            const end = start + size;
            
            // Eğer sayfa sınırını aşıyorsa boş dizi dön (Infinite scroll durması için)
            if (start >= filtered.length) {
                resolve([]);
            } else {
                resolve(filtered.slice(start, end));
            }
        }, 500);
    });
  }

  // GERÇEK BACKEND İSTEĞİ
  try {
    const page = filters.page || 0;
    const size = filters.size || 12;
    const sort = filters.sort || 'default';
    const bodyData = { ...filters };
    delete bodyData.page;
    delete bodyData.size;
    delete bodyData.sort;

    const response = await api.post('/v2/product/filter', bodyData, {
      params: { page, size, sort }
    });
    return response.data;
  } catch (error) {
    console.error("Ürünler çekilemedi:", error);
    return []; 
  }
};

// Ürün Detayı
export const getProductById = async (id) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
        const product = mockProducts.find(p => p.id === id);
        setTimeout(() => {
            if (product) resolve(product);
            else reject(new Error("Ürün bulunamadı"));
        }, 300);
    });
  }
  const response = await api.get('/v2/product/search-by-id', { 
    params: { productId: id } 
  });
  return response.data;
};

// Kategoriler
export const getStoreCategories = async () => {
    if (USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve(mockCategories), 300));
    }
    const response = await api.get('/v2/category'); 
    return response.data;
};


// ==============================
// 🔧 ADMIN TARAFI
// ==============================

// Admin Ürün Listesi
export const getAdminProducts = async () => {
  if (USE_MOCK) {
    return new Promise(resolve => setTimeout(() => resolve(mockProducts), 500));
  }
  const response = await api.get('/v1/product');
  return response.data;
};

// Kategorileri Getir (Admin)
export const getCategories = async () => {
    if (USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve(mockCategories), 300));
    }
    const response = await api.get('/v1/category'); 
    return response.data;
};

// MOCK Modunda bu işlemler sadece "Başarılıymış gibi" yapar ama veriyi gerçekten kaydetmez.
export const createCategory = async (categoryData) => {
  if (USE_MOCK) {
      console.log("MOCK: Kategori eklendi ->", categoryData);
      return { id: Math.random().toString(), ...categoryData };
  }
  const response = await api.post('/v1/category', categoryData); 
  return response.data;
};

export const addProduct = async (productData) => {
  if (USE_MOCK) {
      console.log("MOCK: Ürün eklendi ->", productData);
      return { id: Math.random().toString(), ...productData };
  }
  const response = await api.post('/v1/product', productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  if (USE_MOCK) {
      console.log("MOCK: Ürün silindi ->", id);
      return { success: true };
  }
  const response = await api.delete(`/v1/product`, {
    params: { productId: id } 
  });
  return response.data;
};

export const updateProduct = async (productData) => {
  if (USE_MOCK) {
     console.log("MOCK: Ürün güncellendi ->", productData);
     return productData;
  }
  const response = await api.put('/v1/product', productData);
  return response.data;
};