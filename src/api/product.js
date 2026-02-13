import { mockProducts, mockCategories } from '../data/mockData';

const simulateApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

// ... (getProducts ve getFilteredProducts kısımları aynı kalabilir) ...
export const getProducts = async () => await simulateApiCall(mockProducts);

export const getFilteredProducts = async (filters = {}) => {
    // Filtreleme mantığı frontend'de yapılıyor ama burası tüm listeyi dönmeli
    return await simulateApiCall(mockProducts);
};

// --- ÖNEMLİ DÜZELTME BURADA ---
export const getProductById = async (id) => {
  console.log("Aranan ID:", id); // Konsola bak: Ne aranıyor?
  
  // Hem sayıya çevirip hem de metin olarak arayalım (Garanti olsun)
  const product = mockProducts.find((p) => 
    p.id === Number(id) || p.id.toString() === id.toString()
  );

  if (!product) {
    console.warn("DİKKAT: Ürün Bulunamadı! Mock Data'daki ID'ler şunlar:", mockProducts.map(p => p.id));
  } else {
    console.log("Ürün Bulundu:", product.name || product.title);
  }

  return await simulateApiCall(product);
};

export const getStoreCategories = async () => await simulateApiCall(mockCategories);

// ... (Admin fonksiyonları aynı kalabilir) ...
export const getAdminProducts = async () => await simulateApiCall(mockProducts);
export const getCategories = async () => await simulateApiCall(mockCategories);
export const createCategory = async () => await simulateApiCall({ success: true });
export const addProduct = async () => await simulateApiCall({ success: true });
export const deleteProduct = async () => await simulateApiCall({ success: true });
export const updateProduct = async () => await simulateApiCall({ success: true });