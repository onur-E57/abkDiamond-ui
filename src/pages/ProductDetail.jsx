import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api/product'; 
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// Favori hook'u güvenli kullanım
// import { useFavorites } from '../context/FavoritesContext'; 

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  const [selectedOption, setSelectedOption] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        
        if (data) {
          setProduct(data);
          const images = data.images || data.imageUrls || [];
          if (images.length > 0) {
            setActiveImage(images[0]);
          } else {
            setActiveImage(data.image || "/img/placeholder.png");
          }
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

  const getCategoryName = () => {
    if (!product) return '';
    if (product.categoryName) return product.categoryName.toUpperCase();
    if (product.category && typeof product.category === 'object' && product.category.name) {
        return product.category.name.toUpperCase();
    }
    if (product.category && typeof product.category === 'string') {
        return product.category.toUpperCase();
    }
    return '';
  };

  const renderProductOptions = () => {
    if (!product) return null;
    const category = getCategoryName();

    // YÜZÜK
    if (['RING', 'YUZUK', 'YÜZÜK', 'YUZUKLER', 'YÜZÜKLER'].some(c => category.includes(c))) {
      return (
        <div className="product-option-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Yüzük Ölçüsü:</label>
          <select 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            value={selectedOption} 
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Seçiniz...</option>
            {[...Array(20)].map((_, i) => (
               <option key={i} value={i + 8}>{i + 8}</option>
            ))}
          </select>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>* Standart ölçü: 12-14 arasıdır.</p>
        </div>
      );
    }

    // KOLYE / BİLEKLİK
    const necklaceKeywords = ['NECKLACE', 'KOLYE', 'ZINCIR', 'ZİNCİR'];
    const braceletKeywords = ['BRACELET', 'BILEKLIK', 'BİLEKLİK'];
    
    if ([...necklaceKeywords, ...braceletKeywords].some(c => category.includes(c))) {
      return (
        <div className="product-option-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Uzunluk (cm):</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['40', '45', '50', '55', '60'].map((len) => (
              <button
                key={len}
                onClick={() => setSelectedOption(len)}
                style={{
                    padding: '8px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: selectedOption === len ? '#000' : '#fff',
                    color: selectedOption === len ? '#fff' : '#000',
                    cursor: 'pointer'
                }}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleAddToCart = () => {
    if (!product) return;
    const category = getCategoryName();
    const sizeRequiredKeywords = ['RING', 'YUZUK', 'YÜZÜK', 'NECKLACE', 'KOLYE', 'BRACELET', 'BILEKLIK', 'BİLEKLİK'];

    if (sizeRequiredKeywords.some(k => category.includes(k)) && !selectedOption) {
        toast.warn("Lütfen ürün için bir seçenek belirtiniz.");
        return;
    }
    addToCart(product, selectedOption); 
    toast.success("Sepete eklendi!");
  };

  // --- HTML YAPISI (TEMPLATE CLASS'LARIYLA) ---
  
  // ÖNEMLİ: "page-padding-top" ve "section-padding" class'ları 
  // içeriğin header'ın altında kalmamasını sağlar.
  return (
    <div className="product-details-wrapper section-padding page-padding-top">
      <div className="container">
        
        {loading ? (
             <div style={{ textAlign: 'center', padding: '50px' }}>Yükleniyor...</div>
        ) : !product ? (
             <div style={{ textAlign: 'center', padding: '50px' }}>Ürün bulunamadı.</div>
        ) : (
            <div className="product-details-inner" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                
                {/* SOL TARA: RESİM */}
                <div className="product-gallery" style={{ flex: '1', minWidth: '300px' }}>
                    <div className="main-image" style={{ marginBottom: '20px', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                        <img 
                            src={activeImage || "/img/placeholder.png"} 
                            alt={product.name} 
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            onError={(e) => { e.target.src = "/img/placeholder.png"; }}
                        />
                    </div>
                    {/* Küçük Resimler */}
                    {(product.images || product.imageUrls) && (product.images || product.imageUrls).length > 1 && (
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                            {(product.images || product.imageUrls).map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    alt="thumb" 
                                    onClick={() => setActiveImage(img)}
                                    style={{ 
                                        width: '80px', height: '80px', objectFit: 'cover', 
                                        border: activeImage === img ? '2px solid #000' : '1px solid #eee',
                                        cursor: 'pointer', borderRadius: '4px'
                                    }} 
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* SAĞ TARAF: BİLGİLER */}
                <div className="product-info" style={{ flex: '1', minWidth: '300px' }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '10px', fontFamily: 'serif' }}>{product.name || product.title}</h1>
                    
                    <div className="price-area" style={{ fontSize: '24px', fontWeight: 'bold', color: '#c5a059', marginBottom: '20px' }}>
                        {product.price?.toLocaleString()} TL
                        {product.oldPrice && (
                            <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through', marginLeft: '15px' }}>
                                {product.oldPrice.toLocaleString()} TL
                            </span>
                        )}
                    </div>

                    <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '30px' }}>
                        {product.description || "Bu ürün özel işçilikle üretilmiştir."}
                    </p>

                    {renderProductOptions()}

                    <div className="action-buttons" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleAddToCart}
                            style={{ flex: '1', padding: '15px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            SEPETE EKLE
                        </button>
                        
                        <a 
                            href="https://wa.me/905555555555" 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ 
                                width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                border: '1px solid #25D366', color: '#25D366', borderRadius: '4px', fontSize: '24px' 
                            }}
                        >
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </a>
                    </div>
                    
                    <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '14px', color: '#777' }}>
                        <p>✓ Ücretsiz Kargo</p>
                        <p>✓ Sertifikalı Ürün</p>
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
}