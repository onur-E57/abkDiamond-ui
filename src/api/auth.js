// src/api/auth.js

// Yardımcı gecikme fonksiyonu
const simulateApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 800); // Biraz daha uzun bekletelim, giriş yapıyormuş hissi versin
  });
};

// GİRİŞ YAPMA (MOCK)
export const login = async (credentials) => {
  console.log("Mock Giriş Denemesi:", credentials);

  // Her türlü girişi kabul edelim
  return await simulateApiCall({
    accessToken: "mock-access-token-12345", // Sahte Token
    user: {
      id: 1,
      name: "Onur Elmas",
      email: credentials.email,
      role: "ADMIN" // Admin paneline girebilmek için
    }
  });
};

// KAYIT OLMA (MOCK)
export const register = async (userData) => {
  console.log("Mock Kayıt:", userData);
  return await simulateApiCall({
    success: true,
    message: "Kayıt başarılı (Mock)"
  });
};