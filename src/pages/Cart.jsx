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
      <div className="container section-padding text-center page-padding-top cart-empty-container">
        <div className="cart-empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h2>Sepetinizde ürün bulunmamaktadır.</h2>
        <p className="cart-empty-text">Hemen alışverişe başlayıp ışıltınıza kavuşun.</p>
        <Link to="/koleksiyon" className="btn btn-primary">Alışverişe Başla</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page-container page-padding-top">
      {/* SOL: Ürün Listesi */}
      <div className="cart-items-area">
        <div className="cart-header-row">
            <div className="col-product">Ürün</div>
            <div className="col-price">Fiyat</div>
            <div className="col-qty">Adet</div>
            <div className="col-action">İşlem</div>
        </div>

        <div className="cart-list">
            {cart.map((item, index) => (
              <div key={index} className="cart-item-row">
                
                {/* 1. Ürün Bilgisi */}
                <div className="cart-cell col-product">
                  <div className="cart-product-info">
                    <Link to={`/urun/${item.id}`} className="cart-img-wrapper">
                      <img 
                          src={item.imageUrl || item.img || "/img/placeholder.png"} 
                          alt={item.name} 
                      />
                    </Link>
                    <div className="cart-info-text">
                      <Link to={`/urun/${item.id}`} className="cart-item-title">{item.name}</Link>
                      {item.size && <span className="cart-item-variant">Ölçü: {item.size}</span>}
                      <span className="cart-item-variant detail">
                          {item.metalType} {item.purity}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 2. Fiyat */}
                <div className="cart-cell col-price">
                    <span className="mobile-label">Fiyat:</span>
                    <span className="price-text">{item.price?.toLocaleString()} TL</span>
                </div>

                {/* 3. Adet Butonları */}
                <div className="cart-cell col-qty">
                  <span className="mobile-label">Adet:</span>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item.id, item.size)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => increaseQuantity(item.id, item.size)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 4. Aksiyonlar */}
                <div className="cart-cell col-action">
                  <div className="cart-actions-wrapper">
                    <button 
                      className={`cart-action-btn favorite-btn ${isFavorite(item.id) ? 'active' : ''}`} 
                      aria-label="Favoriye Ekle" 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(item);
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(item.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    <button 
                      className="cart-remove-btn" 
                      onClick={() => handleRemoveItem(item)}
                      title="Sepetten Kaldır"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            ))}
        </div>
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
          <div className="shipping-info">
            <span className="shipping-original">79.90 TL</span>
            <span className="shipping-free">Ücretsiz</span>
          </div>
        </div> 
        
        <div className="summary-divider"></div>

        <div className="summary-row total">
          <span>Genel Toplam</span>
          <span>{totalPrice.toLocaleString()} TL</span>
        </div>

        <button className="btn-checkout">ALIŞVERİŞİ TAMAMLA</button>
        
        <div className="secure-badges">
            <span>🔒 Güvenli Ödeme</span>
            <span>✨ Lisanslı Ürün</span>
        </div>
      </div>

    </div>
  );
}