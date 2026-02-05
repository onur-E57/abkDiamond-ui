import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/product';
import { useFavorites } from '../context/FavoritesContext';
import TopBar from '../components/TopBar';
import '../index.css'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        
        const allProducts = Array.isArray(data) ? data : data.content || [];
        
        setProducts(allProducts.slice(0, 8));

      } catch (error) {
        console.error("Ana sayfa ürünleri yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  
  return (
    <main>
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-subtitle">Eşsiz ve Zamansız</span>
          <h1 className="hero-title">
            Işıltını <span>Keşfet</span>
          </h1>
          <p className="hero-desc">
            En özel anlarınız için tasarlanmış pırlanta ve altın koleksiyonları.
          </p>
          
          <div className="hero-buttons">
            <Link to="/koleksiyon" className="btn btn-primary">Koleksiyonu İncele</Link>
            <Link to="/hakkimizda" className="btn btn-outline">Hikayemiz</Link>
          </div>
        </div>
      </section>

      <TopBar />

      {/* 2. ÜRÜN VİTRİNİ */}
      <section className="section-padding container">
        
        <div className="section-title">
          <h2>Öne Çıkanlar</h2>
          <div className="divider"></div>
        </div>

        {loading ? (
           // Yükleniyor Animasyonu
           <div className="loading-spinner">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12l4 6-10 13L2 9z"></path>
             </svg>
             Yükleniyor...
           </div>
        ) : (
          <div className="product-grid">
            
            {products.length > 0 ? products.map((product) => (
              <div className="product-card" key={product.id}>
                
                <div className="product-image">
                  {product.badge && (
                    <span className={`product-badge ${product.badge === 'İndirim' ? 'sale' : ''}`}>
                      {product.badge}
                    </span>
                  )}
                  
                  {product.oldPrice && product.price < product.oldPrice && !product.badge && (
                     <span className="product-badge sale">İndirim</span>
                  )}

                  <Link to={`/urun/${product.id}`} className="product-image-link">
                    <img 
                      src={product.imageUrls?.[0] || product.imageUrl || "/img/placeholder.png"}
                      alt={product.name}
                      onError={(e) => { e.target.src = "/img/placeholder.png"; }} 
                    />
                  </Link>
                  
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </Link>

                  </div>
                </div>

                <div className="product-details">
                  <h3 className="product-title">
                    <Link to={`/urun/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="product-price">
                    {product.oldPrice && <del>{product.oldPrice.toLocaleString()} TL</del>}
                    {product.price?.toLocaleString()} TL
                  </div>
                </div>

              </div>
            )) : (
              <p className="text-center" style={{width:'100%'}}>Henüz ürün eklenmemiş.</p>
            )}
          </div>
        )}
      </section>

    </main>
  );
}