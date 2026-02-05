import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import { useFavorites } from '../context/FavoritesContext';

export default function Favorites() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="section-padding container">
      <div className="section-title">
        <h2>Favorilerim</h2>
        <div className="divider"></div>
      </div>

      {favorites.length > 0 ? (
        <div className="product-grid">
          {favorites.map((product) => (
            <div className="product-card" key={product.id}>
              
              <div className="product-image">
                <Link to={`/urun/${product.id}`}>
                  <img 
                    src={product.imageUrl || product.image || "/img/placeholder.png"} 
                    alt={product.name}
                    onError={(e) => { e.target.src = "/img/placeholder.png"; }} 
                  />
                </Link>
                
                {/* ÇÖP KUTUSU / KALDIR BUTONU */}
                <button 
                  className="action-btn" 
                  onClick={() => toggleFavorite(product)}
                  title="Favorilerden Kaldır"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                {/* Favori ve Sepete ekle butonu */}
                <div className="product-actions">
                    <button 
                      className="action-btn" 
                      aria-label="Favoriye Ekle" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(product);
                      }}
                    >
                      <svg 
                          width="20" height="20" viewBox="0 0 24 24" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          fill={isFavorite(product.id) ? "currentColor" : "none"} 
                          style={{ 
                            color: isFavorite(product.id) ? 'var(--primary-gold)' : 'currentColor',
                            transition: 'all 0.3s ease' 
                          }}
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                  <Link to={`/urun/${product.id}`} className="action-btn" title="Ürüne Git">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </Link>
                </div>
              </div>

              <div className="product-details">
                <h3 className="product-title">
                  <Link to={`/urun/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="product-price">
                  {typeof product.price === 'number' 
                    ? product.price.toLocaleString() 
                    : product.price} TL
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h3>Favori listeniz henüz boş.</h3>
          <p>Beğendiğiniz ürünlerdeki ❤️ ikonuna tıklayarak buraya ekleyebilirsiniz.</p>
          <Link to="/koleksiyon" className="btn btn-primary">
            Koleksiyonu Keşfet
          </Link>
        </div>
      )}
    </div>
  );
}