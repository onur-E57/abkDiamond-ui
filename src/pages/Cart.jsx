import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import '../index.css';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'react-toastify';

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleRemoveItem = (item) => {
    removeFromCart(item.id, item.size);

    toast.info(
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
         </svg>
         <span>{item.name} sepetten çıkarıldı.</span>
      </div>
    );
  };

  if (cart.length === 0) {
    return (
      <div className="container section-padding text-center page-padding-top">
        <h2>Sepetinizde ürün bulunmamaktadır.</h2>
        <p style={{marginBottom: '30px', color: '#666'}}>Hemen alışverişe başlayıp ışıltınıza kavuşun.</p>
        <Link to="/koleksiyon" className="btn btn-primary">Alışverişe Başla</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page-container page-padding-top">
      
      {/* SOL: Ürün Listesi */}
      <div className="cart-items-area">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Fiyat</th>
              <th>Adet</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index} className="cart-item-row">
                <td>

                  <div className="cart-product-info">
                    <Link to={`/urun/${item.id}`}>
                      <img 
                          src={item.imageUrl || item.img || "/img/placeholder.png"} 
                          alt={item.name} 
                      />
                    </Link>
                    <div>
                      <Link to={`/urun/${item.id}`} className="cart-item-title">{item.name}</Link>
                      {item.size && <span className="cart-item-size">Ölçü: {item.size}</span>}
                      <span className="cart-item-size" style={{display:'block', fontSize:'0.75rem', marginTop:'4px', opacity:0.7}}>
                          {item.metalType} {item.purity}
                      </span>
                    </div>
                  </div>
                </td>
                
                <td>{item.price?.toLocaleString()} TL</td>

                {/* --- ADET BUTONU --- */}
                <td>
                  <div className="quantity-controls">
                    {/* AZALT */}
                    <button 
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item.id, item.size)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    {/* SAYI */}
                    <span className="qty-value">{item.quantity}</span>

                    {/* ARTIR */}
                    <button 
                      className="qty-btn"
                      onClick={() => increaseQuantity(item.id, item.size)}
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* 4. AKSİYONLAR (KALP VE ÇÖP KUTUSU) */}
                <td>
                  <div className="cart-actions-wrapper">
                    
                    <button 
                      className="cart-action-btn favorite-btn" 
                      aria-label="Favoriye Ekle" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(item);
                      }}
                    >
                      <svg 
                          width="20" height="20" viewBox="0 0 24 24" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          fill={isFavorite(item.id) ? "currentColor" : "none"} 
                          style={{ 
                            color: isFavorite(item.id) ? 'var(--primary-gold)' : 'currentColor',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    {/* --- SİLME BUTONU --- */}
                    <button 
                      className="cart-remove-btn" 
                      onClick={() => handleRemoveItem(item)}
                      title="Sepetten Tamamen Kaldır"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SAĞ: Özet Kutusu */}
      <div className="cart-summary-area">
        <h3 className="summary-title">Sipariş Özeti</h3>
        <div className="summary-row">
          <span>Ara Toplam</span>
          <span>{totalPrice.toLocaleString()} TL</span>
        </div>
        <div className="summary-row">
          <span>Kargo</span>
          <span style={{ textDecoration: 'line-through' }}>Ücretsiz</span>
        </div> 
        
        <div className="summary-row total">
          <span>Genel Toplam</span>
          <span>{totalPrice.toLocaleString()} TL</span>
        </div>

        <button className="btn-checkout">ALIŞVERİŞİ TAMAMLA</button>
      </div>

    </div>
  );
}