import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFilteredProducts, getStoreCategories } from '../api/product'; 
import { useFavorites } from '../context/FavoritesContext';
import '../index.css'; 

const SORT_OPTIONS = [
  { label: 'Varsayılan Sıralama', value: 'default' },
  { label: 'Fiyat: Artan', value: 'price_asc' },
  { label: 'Fiyat: Azalan', value: 'price_desc' },
  { label: 'İsim: A-Z', value: 'name_asc' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorites();
  
  // --- FİLTRE STATE'LERİ ---
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
  const [searchText, setSearchText] = useState(''); // İsimle Arama
  const [priceRange, setPriceRange] = useState({ min: '', max: '' }); // Fiyat Aralığı
  
  const [sortOption, setSortOption] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 1. Kategorileri Çek (Sayfa açılınca 1 kere çalışır)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getStoreCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Ürünleri Filtrele ve Çek
  // Bu fonksiyon; Kategori, Arama veya Fiyat değiştiğinde tetiklenecek
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      // Backend'in beklediği JSON formatını hazırlıyoruz
      const payload = {};

      if (selectedCategoryId) payload.categoryId = selectedCategoryId;
      if (searchText) payload.name = searchText;
      if (priceRange.min) payload.minPrice = parseFloat(priceRange.min);
      if (priceRange.max) payload.maxPrice = parseFloat(priceRange.max);

      // API isteğini atıyoruz (product.js içinde POST olarak ayarlamıştık)
      const data = await getFilteredProducts(payload);
      setProducts(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Ürünler yüklenemedi:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Kategori değişince otomatik çek
  useEffect(() => {
    fetchFilteredProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]); 

  // "Filtrele" butonuna basınca çalışacak fonksiyon
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProducts();
    setIsFilterOpen(false); // Mobildeysek menüyü kapat
  };

  // Filtreleri Temizle
  const handleClearFilters = () => {
    setSearchText('');
    setPriceRange({ min: '', max: '' });
    setSelectedCategoryId('');
    // State güncellemeleri asenkron olduğu için direkt fonksiyonu çağırıyoruz
    // Ancak state'in sıfırlanmasını beklemek için useEffect kullanmak daha sağlıklı olabilir
    // Pratik çözüm: Sayfayı yeniletmek veya manuel sıfırla çağırmak.
    window.location.reload(); 
  };

  // 3. Sıralama (Client-Side)
  const getSortedProducts = () => {
    let sorted = [...products]; 

    if (sortOption === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name_asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return sorted;
  };

  const displayedProducts = getSortedProducts();

  return (
    <div className="products-page-wrapper section-padding page-padding-top">
      <div className="container products-layout">
        
        {/* MOBİL FİLTRE BUTONU */}
        <div 
            className="mobile-filter-toggle" 
            onClick={() => setIsFilterOpen(true)}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            FİLTRELE & ARA
        </div>

        {/* --- SIDEBAR (FİLTRELER) --- */}
        <aside className={`sidebar ${isFilterOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3>Filtreler</h3>
            <button className="close-sidebar" onClick={() => setIsFilterOpen(false)}>&times;</button>
          </div>

          {/* ARAMA VE FİYAT FORMU */}
          <form onSubmit={handleFilterSubmit} className="filter-form">
            
            {/* 1. İSİM ARAMA */}
            <div className="filter-group">
                <h4 className="filter-title">ARA</h4>
                <input 
                    type="text" 
                    placeholder="Ürün adı ara..." 
                    className="filter-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* 2. KATEGORİLER */}
            <div className="filter-group">
                <h4 className="filter-title">KATEGORİLER</h4>
                <ul className="filter-list">
                <li 
                    className={selectedCategoryId === '' ? 'active' : ''} 
                    onClick={() => setSelectedCategoryId('')}
                >
                    Tümü
                </li>
                {categories.map((cat) => (
                    <li 
                    key={cat.id} 
                    className={selectedCategoryId === cat.id ? 'active' : ''} 
                    onClick={() => setSelectedCategoryId(cat.id)}
                    >
                    {cat.name} 
                    </li>
                ))}
                </ul>
            </div>

            {/* 3. FİYAT ARALIĞI */}
            <div className="filter-group">
                <h4 className="filter-title">FİYAT ARALIĞI (TL)</h4>
                <div className="filter-section">
                    <input 
                        type="number" 
                        placeholder="Min" 
                        className="filter-input"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    />
                    <span>-</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        className="filter-input"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    />
                </div>
            </div>

            {/* BUTONLAR */}
            <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>
                UYGULA
            </button>
            <button 
                type="button" 
                className="btn btn-secondary" 
                style={{width:'100%', marginTop:'10px', background:'#f0f0f0', color:'#333'}}
                onClick={handleClearFilters}
            >
                Temizle
            </button>

          </form>

          {/* SIRALAMA (SIDEBAR İÇİNDE GÖRÜNSÜN İSTERSEN) */}
          <div className="filter-group" style={{marginTop:'30px'}}>
            <h4 className="filter-title">SIRALAMA</h4>
            <select 
                className="sort-select" 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
            >
              {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </aside>

        {isFilterOpen && (
            <div className="nav-backdrop active" style={{zIndex: 1999}} onClick={() => setIsFilterOpen(false)}></div>
        )}

        {/* --- ÜRÜN LİSTESİ --- */}
        <main className="products-grid-area">
          <div className="products-header">
            <h1>Koleksiyonumuz</h1>
            <p>{displayedProducts.length} ürün listeleniyor</p>
          </div>

          {loading ? (
            <div className="loading-spinner">💎 Yükleniyor...</div>
          ) : (
            <>
                {displayedProducts.length > 0 ? (
                    <div className="product-grid">
                    {displayedProducts.map((product) => (
                        <div className="product-card" key={product.id}>
                        
                        <div className="product-image">
                            <Link to={`/urun/${product.id}`}>
                                <img 
                                    src={
                                      (product.imageUrls && product.imageUrls.length > 0) 
                                        ? product.imageUrls[0] 
                                        : (product.imageUrl || "https://placehold.co/600x800?text=Resim+Yok")
                                    } 
                                    alt={product.name} 
                                    onError={(e) => { e.target.src = "https://placehold.co/600x800?text=Hata"; }}
                                />
                            </Link>
                          <div className="product-actions">
                            <button className="action-btn" onClick={() => toggleFavorite(product)}>
                              <svg 
                                  width="20" height="20" viewBox="0 0 24 24" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                  fill={isFavorite(product.id) ? "currentColor" : "none"} 
                                  style={{ color: isFavorite(product.id) ? 'var(--primary-gold)' : 'none' }}
                                >
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                            </button>
                            <Link to={`/urun/${product.id}`} className="action-btn">
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
                                {product.price?.toLocaleString()} TL
                            </div>
                        </div>

                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <h3>Aradığınız kriterlere uygun ürün bulunamadı.</h3>
                        <button 
                            className="btn btn-primary" 
                            style={{marginTop:'20px'}}
                            onClick={handleClearFilters}
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}