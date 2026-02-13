// src/api/product.js (veya services/product.js)
import { mockProducts, mockCategories } from '../data'; // Yolunu kendine göre ayarla

// Yardımcı Fonksiyon: Gerçek API gecikmesini taklit edelim (0.5 saniye)
const simulateApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

// ==============================
// 🛍️ MÜŞTERİ TARAFI (MOCK)
// ==============================

// Vitrin ve Koleksiyon Listesi
export const getProducts = async (params = {}) => {
  // Tüm ürünleri döndür
  return await simulateApiCall(mockProducts);
};

// Filtreleme ve Sayfalama
export const getFilteredProducts = async (filters = {}) => {
  // Gerçek backend gibi sayfalama yapısı (Pagination) dönmemiz gerekebilir
  // Eğer UI direkt array bekliyorsa mockProducts dön.
  // Eğer UI "content" içinde bekliyorsa aşağıdaki yapıyı kullan:
  
  const mockResponse = {
    content: mockProducts, // Ürün listesi
    totalPages: 1,
    totalElements: mockProducts.length,
    size: mockProducts.length,
    number: 0
  };

  // Eğer sadece array dönüyorsa direkt: return await simulateApiCall(mockProducts);
  return await simulateApiCall(mockResponse); 
};

// Ürün Detayı
export const getProductById = async (id) => {
  // ID string gelebilir, sayıya çevirip arayalım
  const product = mockProducts.find((p) => p.id === Number(id));
  return await simulateApiCall(product);
};

// Kategorileri Getir
export const getStoreCategories = async () => {
    return await simulateApiCall(mockCategories);
};

// ==============================
// 🔧 ADMIN TARAFI (MOCK - İşlevsiz)
// ==============================
// Admin fonksiyonları hata vermesin diye sahte başarılı yanıtlar döndürüyoruz.

export const getAdminProducts = async () => {
  return await simulateApiCall(mockProducts);
};

export const getCategories = async () => {
    return await simulateApiCall(mockCategories);
};

export const createCategory = async (categoryData) => {
  console.log("Mock Kategori Eklendi:", categoryData);
  return await simulateApiCall({ success: true, message: "Mock: Kategori eklendi" });
};

export const addProduct = async (productData) => {
  console.log("Mock Ürün Eklendi:", productData);
  return await simulateApiCall({ success: true, message: "Mock: Ürün eklendi" });
};

export const deleteProduct = async (id) => {
  console.log("Mock Ürün Silindi ID:", id);
  return await simulateApiCall({ success: true, message: "Mock: Ürün silindi" });
};

export const updateProduct = async (productData) => {
  console.log("Mock Ürün Güncellendi:", productData);
  return await simulateApiCall({ success: true, message: "Mock: Ürün güncellendi" });
};