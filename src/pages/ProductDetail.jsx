import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../index.css';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api/product'; // Artık Mock çalışıyor
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// useFavorites hook'unu kullanıyorsan import et, yoksa bu satırı ve aşağıdaki kullanımını kaldırabilirsin
// import { useFavorites } from '../context/FavoritesContext'; 

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  // Eğer FavoritesContext henüz mocklanmadıysa veya hata veriyorsa bu kısmı geçici olarak pasife alabilirsin
  // const { toggleFavorite, isFavorite } = useFavorites(); 
  
  const [selectedOption, setSelectedOption] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        // getProductById artık mockData içinden id'ye göre ürünü bulup getirecek
        const data = await getProductById(id);
        
        if (data) {
          setProduct(data);
          // Görsel seçimi: Mock veride 'images' dizisi veya tek 'image' olabilir
          const images = data.images || data.imageUrls || [];
          if (images.length > 0) {
            setActiveImage(images[0]);
          } else {
            setActiveImage(data.image || "/img/placeholder.png");
          }
        }
      } catch (error) {
        console.error("Ürün detayı çekilemedi:", error);
        toast.error("Ürün bilgileri yüklenirken bir hata oluştu.");
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
    if (!product) return '';
    
    // Mock veride categoryName alanı olabilir
    if (product.categoryName) return product.categoryName.toUpperCase();
    
    // Eski yapıdaki gibi obje veya string olabilir
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

    // --- YÜZÜK İSE ---
    if (['RING', 'YUZUK', 'YÜZÜK', 'YUZUKLER', 'YÜZÜKLER'].some(c => category.includes(c))) {
      return (
        <div className="option-group mb-4">
          <label className="block text-sm font-medium mb-2">Yüzük Ölçüsü:</label>
          <select 
            className="w-full p-2 border rounded" 
            value={selectedOption} 
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Seçiniz...</option>
            {[...Array(20)].map((_, i) => (
               <option key={i} value={i + 8}>{i + 8}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">* Standart ölçü: 12-14 arasıdır.</p>
        </div>
      );
    }

    // --- KOLYE VEYA BİLEKLİK İSE ---
    const necklaceKeywords = ['NECKLACE', 'KOLYE', 'ZINCIR', 'ZİNCİR'];
    const braceletKeywords = ['BRACELET', 'BILEKLIK', 'BİLEKLİK'];
    
    if ([...necklaceKeywords, ...braceletKeywords].some(c => category.includes(c))) {
      return (
        <div className="option-group mb-4">
          <label className="block text-sm font-medium mb-2">Zincir/Bileklik Uzunluğu (cm):</label>
          <div className="flex gap-2">
            {['40', '45', '50', '55', '60'].map((len) => (
              <button
                key={len}
                onClick={() => setSelectedOption(len)}
                className={`px-3 py-1 border rounded ${selectedOption === len ? 'bg-black text-white' : 'bg-white text-black'}`}
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

    // Eğer yüzük/kolye ise ve seçenek seçilmediyse uyar
    if (sizeRequiredKeywords.some(k => category.includes(k)) && !selectedOption) {
        toast.warn("Lütfen ürün için bir ölçü/uzunluk seçiniz. 📏");
        return;
    }

    // Sepete eklerken seçeneği de gönder
    addToCart(product, selectedOption); 
    toast.success("Mükemmel seçim! Ürün sepetinize eklendi.");
  };

  if (loading) return (       
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20">Ürün bulunamadı veya kaldırılmış olabilir.</div>;

  // Mock verideki resim listesini alalım
  const imageList = product.images || product.imageUrls || [product.image];

  return (
    <div className="container mx-auto px-4 py-8 mt-20 flex flex-col md:flex-row gap-8">
      
      {/* SOL: Resim Galerisi */}
      <div className="w-full md:w-1/2">
        <div className="w-full h-[500px] mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <img 
            src={activeImage || "/img/placeholder.png"} 
            alt={product.name || product.title} 
            className="max-w-full max-h-full object-contain"
            onError={(e) => { e.target.src = "/img/placeholder.png"; }}
          />
        </div>
        
        {imageList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imageList.map((img, index) => (
              <div 
                key={index} 
                className={`w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded-md overflow-hidden ${activeImage === img ? 'border-black' : 'border-transparent'}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`thumb-${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SAĞ: Bilgiler */}
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-serif mb-2">{product.name || product.title}</h1>
        <div className="text-2xl font-bold mb-6 text-yellow-600">
             {product.price?.toLocaleString()} TL
             {product.oldPrice && <span className="text-gray-400 text-lg line-through ml-3">{product.oldPrice.toLocaleString()} TL</span>}
        </div>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {product.description || "Bu özel parça, ustalarımız tarafından özenle hazırlanmıştır."}
        </p>

        {renderProductOptions()}

        <div className="flex gap-4 mt-8">
          <button 
            className="flex-1 bg-black text-white py-4 rounded hover:bg-gray-800 transition-colors uppercase font-tracking-wider" 
            onClick={handleAddToCart}
          >
            Sepete Ekle
          </button>

          {/* Favori butonu (Geçici olarak pasif veya dummy) */}
          <button 
            className="w-14 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
            onClick={() => toast.info("Favorilere ekleme özelliği yakında!")}
          >
            ♡
          </button>

          <a href="#" className="w-14 flex items-center justify-center border border-green-500 text-green-500 rounded hover:bg-green-50">
            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500 space-y-2">
          <p>🚚 Ücretsiz ve Sigortalı Kargo</p>
          <p>🛡️ Sertifikalı Ürün: {product.metalType || '14 Ayar'} {product.color || 'Altın'}</p>
          <p>↺ 14 Gün İçinde İade Garantisi</p>
        </div>
      </div>

    </div>
  );
}