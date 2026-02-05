import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const localData = localStorage.getItem('favorites');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    const existingIndex = favorites.findIndex(item => item.id === product.id);

    if (existingIndex >= 0) {
      const newFavorites = favorites.filter(item => item.id !== product.id);
      setFavorites(newFavorites);
      toast.error(`${product.name} favorilerden çıkarıldı.`);
    } else {
      setFavorites([...favorites, product]);
      toast.success(`${product.name} favorilere eklendi! ❤️`);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};