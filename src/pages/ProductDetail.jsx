import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api/product';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [selectedOption, setSelectedOption] = useState('');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        if (data.imageUrls && data.imageUrls.length > 0) {
            setActiveImage(data.imageUrls[0]);
        } else if (data.imageUrl) {
            setActiveImage(data.imageUrl);
        }

      } catch (error) {
        console.error("Ürün detayı çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchProductDetail();
    }
  }, [id]);

  // --- YARDIMCI FONKSİYON: KATEGORİ İSMİNİ GÜVENLİ AL ---
  const getCategoryName = () => {
    if (!product || !product.category) return '';
    
    if (typeof product.category === 'object' && product.category.name) {
        return product.category.name.toUpperCase();
    }
    
    if (typeof product.category === 'string') {
        return product.category.toUpperCase();
    }

    return '';
  };

  const renderProductOptions = () => {
    if (!product) return null;

    const category = getCategoryName();

    // --- YÜZÜK İSE ---
    if (['RING', 'YUZUK', 'YÜZÜK', 'YUZUKLER', 'YÜZÜKLER'].some(c => category.includes(c))) {
      return (
        <div className="option-group">
          <label>Yüzük Ölçüsü:</label>
          <select 
            className="size-select" 
            value={selectedOption} 
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Seçiniz...</option>
            {[...Array(20)].map((_, i) => (
               <option key={i} value={i + 8}>{i + 8}</option>
            ))}
          </select>
          <p className="option-note">* Standart ölçü: 12-14 arasıdır.</p>
        </div>
      );
    }

    // --- KOLYE VEYA BİLEKLİK İSE ---
    const necklaceKeywords = ['NECKLACE', 'KOLYE', 'ZINCIR', 'ZİNCİR'];
    const braceletKeywords = ['BRACELET', 'BILEKLIK', 'BİLEKLİK'];
    
    if ([...necklaceKeywords, ...braceletKeywords].some(c => category.includes(c))) {
      return (
        <div className="option-group">
          <label>Zincir/Bileklik Uzunluğu (cm):</label>
          <div className="option-buttons-wrapper">
            {['40', '45', '50', '55', '60'].map((len) => (
              <button
                key={len}
                onClick={() => setSelectedOption(len)}
                className={`btn-option ${selectedOption === len ? 'active' : ''}`}
              >
                {len} cm
              </button>
            ))}
          </div>
        </div>
      );
    }

    // --- KÜPE İSE (Seçenek Yok) ---
    return null;
  };

  // Sepete Ekleme Kontrolü
  const handleAddToCart = () => {
    if (!product) return;
    
    const category = getCategoryName();

    const sizeRequiredKeywords = ['RING', 'YUZUK', 'YÜZÜK', 'NECKLACE', 'KOLYE', 'BRACELET', 'BILEKLIK', 'BİLEKLİK'];

    if (sizeRequiredKeywords.some(k => category.includes(k))) {
        if (!selectedOption) {
            toast.warn("Lütfen ürün için bir ölçü/uzunluk seçiniz. 📏");
            return;
        }
    }

    addToCart(product, selectedOption); 
    
    toast.success("Mükemmel seçim! Ürün sepetinize eklendi.");
  };

  if (loading) return (       
    <div className="loading-spinner">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9z"></path>
      </svg>
      Yükleniyor...
    </div>
  );

  if (!product) return <div className="loading-spinner">Ürün bulunamadı.</div>;

  return (
    <div className="container detail-container page-padding-top-custom-loginPage">
      
      {/* SOL: Resim Galerisi */}
      <div className="detail-gallery">
        <div className="main-image">
          <img 
            src={activeImage || product.imageUrl || "/img/placeholder.png"} 
            alt={product.name} 
            onError={(e) => { e.target.src = "/img/placeholder.png"; }}
          />
        </div>
        
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <div className="thumbnail-list">
            {product.imageUrls.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`thumb-${index}`} />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* SAĞ: Bilgiler */}
      <div className="detail-info">
        <h1 className="detail-title">{product.name}</h1>
        <div className="detail-price">
             {product.price?.toLocaleString()} TL
        </div>
        
        <p className="detail-description">{product.description || "Ürün açıklaması bulunmuyor."}</p>

        {renderProductOptions()}

        <div className="purchase-actions">
          <button className="btn-add-cart" onClick={handleAddToCart}>
            SEPETE EKLE
          </button>

          <button 
            className="action-btn btn-favorite-detail"
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

          <a href="#" className="btn-whatsapp">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>

        <div className="product-meta-info">
          <p>🚚 Ücretsiz ve Sigortalı Kargo</p>
          {/* Metal ve Purity kontrolü */}
          <p>🛡️ Sertifikalı Ürün: {product.metalType || 'Altın'} {product.purity || '14K'}</p>
        </div>
      </div>

    </div>
  );
}