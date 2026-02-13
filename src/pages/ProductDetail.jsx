import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api/product'; 
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

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

    // --- YÜZÜK SEÇENEKLERİ ---
    if (['RING', 'YUZUK', 'YÜZÜK', 'YUZUKLER', 'YÜZÜKLER'].some(c => category.includes(c))) {
      return (
        <div className="option-group">
          <label>Yüzük Ölçüsü:</label>
          {/* index.css: .size-select */}
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
          {/* index.css: .option-note */}
          <p className="option-note">* Standart ölçü: 12-14 arasıdır.</p>
        </div>
      );
    }

    // --- KOLYE / BİLEKLİK SEÇENEKLERİ ---
    const necklaceKeywords = ['NECKLACE', 'KOLYE', 'ZINCIR', 'ZİNCİR'];
    const braceletKeywords = ['BRACELET', 'BILEKLIK', 'BİLEKLİK'];
    
    if ([...necklaceKeywords, ...braceletKeywords].some(c => category.includes(c))) {
      return (
        <div className="option-group">
          <label>Uzunluk (cm):</label>
          {/* index.css: .option-buttons-wrapper */}
          <div className="option-buttons-wrapper">
            {['40', '45', '50', '55', '60'].map((len) => (
              <button
                key={len}
                onClick={() => setSelectedOption(len)}
                // index.css: .btn-option ve .btn-option.active
                className={`btn-option ${selectedOption === len ? 'active' : ''}`}
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

  return (
    // index.css: .section-padding .page-padding-top
    <div className="section-padding page-padding-top">
      {/* index.css: .container */}
      <div className="container">
        
        {loading ? (
             <div className="loading-spinner">Yükleniyor...</div>
        ) : !product ? (
             <div className="no-products"><h3>Ürün bulunamadı.</h3></div>
        ) : (
            // index.css: .detail-container
            <div className="detail-container">
                
                {/* --- SOL TARAF: GALERİ (.detail-gallery) --- */}
                <div className="detail-gallery">
                    {/* index.css: .main-image */}
                    <div className="main-image">
                        <img 
                            src={activeImage || "/img/placeholder.png"} 
                            alt={product.name} 
                            onError={(e) => { e.target.src = "/img/placeholder.png"; }}
                        />
                    </div>
                    
                    {/* index.css: .thumbnail-list */}
                    {(product.images || product.imageUrls) && (product.images || product.imageUrls).length > 1 && (
                        <div className="thumbnail-list">
                            {(product.images || product.imageUrls).map((img, idx) => (
                                <div 
                                    key={idx} 
                                    // index.css: .thumbnail ve .thumbnail.active
                                    className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                                    onClick={() => setActiveImage(img)}
                                >
                                    <img src={img} alt="thumb" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- SAĞ TARAF: BİLGİLER (.detail-info) --- */}
                <div className="detail-info">
                    {/* index.css: .detail-title */}
                    <h1 className="detail-title">{product.name || product.title}</h1>
                    
                    {/* index.css: .detail-price */}
                    <div className="detail-price">
                        {product.price?.toLocaleString()} TL
                        {product.oldPrice && (
                            <span style={{ fontSize: '0.6em', textDecoration: 'line-through', color: '#999', marginLeft: '10px', fontWeight: '400' }}>
                                {product.oldPrice.toLocaleString()} TL
                            </span>
                        )}
                    </div>

                    {/* index.css: .detail-description */}
                    <div className="detail-description">
                        {product.description || "Bu ürün özel işçilikle üretilmiştir ve sertifikalıdır."}
                    </div>

                    {/* Seçenekler (.option-group vb.) */}
                    {renderProductOptions()}

                    {/* index.css: .purchase-actions */}
                    <div className="purchase-actions">
                        {/* index.css: .btn-add-cart */}
                        <button 
                            className="btn-add-cart" 
                            onClick={handleAddToCart}
                        >
                            SEPETE EKLE
                        </button>
                        
                        {/* index.css: .btn-whatsapp */}
                        <a 
                            href="https://wa.me/905555555555" 
                            target="_blank" 
                            rel="noreferrer"
                            className="btn-whatsapp"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </a>
                    </div>
                    
                    {/* index.css: .product-meta-info */}
                    <div className="product-meta-info">
                        <p><i className="icon-check"></i> ✓ Ücretsiz Kargo</p>
                        <p><i className="icon-check"></i> ✓ Sertifikalı Ürün</p>
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
}