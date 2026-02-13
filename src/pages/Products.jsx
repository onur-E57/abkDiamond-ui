import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  // --- STATE YÖNETİMİ ---
  const [allProducts, setAllProducts] = useState([]); // Tüm veriyi burada tutacağız
  const [products, setProducts] = useState([]); // Ekranda gösterilen filtrelenmiş veri
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Filtre State'leri
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
  const [searchText, setSearchText] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Favori hook'u (Hata vermemesi için güvenli erişim)
  const { toggleFavorite, isFavorite } = useFavorites ? useFavorites() : { toggleFavorite: () => {}, isFavorite: () => false };
  
  const location = useLocation();
  const sidebarRef = useRef(null);

  // --- İLK YÜKLEME (Verileri Çek) ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // 1. Kategorileri Al
        const catData = await getStoreCategories();
        setCategories(catData || []);

        // 2. Ürünleri Al (Mock Data'dan hepsi gelir)
        const prodData = await getFilteredProducts();
        const items = Array.isArray(prodData) ? prodData : (prodData.content || []);
        
        setAllProducts(items);
        setProducts(items); // Başlangıçta hepsini göster

      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // --- URL'DEN KATEGORİ SEÇİMİ ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategoryId(Number(cat));
  }, [location.search]);

  // --- FİLTRELEME MANTIĞI (Frontend Side) ---
  useEffect(() => {
    let result = [...allProducts];

    // 1. Arama
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(lower)) || 
        (p.title && p.title.toLowerCase().includes(lower))
      );
    }

    // 2. Kategori
    if (selectedCategoryId) {
      result = result.filter(p => 
        p.categoryId === Number(selectedCategoryId) || 
        (p.category && p.category.id === Number(selectedCategoryId))
      );
    }

    // 3. Fiyat
    if (priceRange.min) {
      result = result.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // 4. Sıralama
    if (sortOption === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name_asc') {
      result.sort((a, b) => (a.name || a.title).localeCompare(b.name || b.title));
    }

    setProducts(result);
  }, [allProducts, searchText, selectedCategoryId, priceRange, sortOption]);

  // --- SIDEBAR KAPATMA (Dışarı tıklayınca) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!event.target.closest('.mobile-filter-toggle')) {
           setIsFilterOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  // --- HANDLERS ---
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setIsFilterOpen(false); // Sadece mobili kapat, filtreleme zaten useEffect ile anlık yapılıyor
  };

  const handleClearFilters = () => {
    setSearchText('');
    setPriceRange({ min: '', max: '' });
    setSelectedCategoryId('');
    setSortOption('default');
    setIsFilterOpen(false);
  };

  return (
    <div className="products-page-wrapper section-padding page-padding-top">
      <div className="container products-layout">
        
        {/* MOBİL FİLTRE BUTONU */}
        <div className="mobile-filter-toggle" onClick={() => setIsFilterOpen(true)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            FİLTRELE VE ARA
        </div>

        {/* --- SIDEBAR --- */}
        <aside ref={sidebarRef} className={`sidebar ${isFilterOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3>Filtreler</h3>
            <button className="close-sidebar" onClick={() => setIsFilterOpen(false)}>&times;</button>
          </div>

          <form onSubmit={handleFilterSubmit} className="filter-form">
            <div className="filter-group">
                <h4 className="filter-title">ARA</h4>
                <input type="text" placeholder="Ürün adı ara..." className="filter-input"
                    value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>

            <div className="filter-group">
                <h4 className="filter-title">KATEGORİLER</h4>
                <ul className="filter-list">
                  <li className={selectedCategoryId === '' ? 'active' : ''} onClick={() => setSelectedCategoryId('')}>Tümü</li>
                  {categories.map((cat) => (
                      <li key={cat.id} className={selectedCategoryId === cat.id ? 'active' : ''} 
                          onClick={() => setSelectedCategoryId(cat.id)}>
                      {cat.name} 
                      </li>
                  ))}
                </ul>
            </div>

            <div className="filter-group">
                <h4 className="filter-title">FİYAT ARALIĞI (TL)</h4>
                <div className="filter-section">
                    <input type="number" placeholder="Min" className="filter-input"
                        value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} />
                    <span>-</span>
                    <input type="number" placeholder="Max" className="filter-input"
                        value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} />
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>UYGULA</button>
            <button type="button" className="btn btn-secondary" style={{width:'100%', marginTop:'10px'}} onClick={handleClearFilters}>Temizle</button>
          </form>
          
          <div className="filter-group" style={{marginTop:'30px'}}>
             <h4 className="filter-title">SIRALAMA</h4>
             <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
             </select>
          </div>
        </aside>

        {isFilterOpen && <div className="nav-backdrop active" onClick={() => setIsFilterOpen(false)}></div>}

        {/* --- ÜRÜN LİSTESİ --- */}
        <main className="products-grid-area">
          <div className="products-header">
            <h1>Koleksiyonumuz</h1>
            <p>{products.length} ürün listeleniyor</p>
          </div>

          {loading ? (
            <div className="loading-spinner">💎 Yükleniyor...</div>
          ) : (
            <>
                {products.length > 0 ? (
                    <div className="product-grid">
                    {products.map((product) => (
                          <div className="product-card" key={product.id}>
                            <div className="product-image">
                                <Link to={`/urun/${product.id}`}>
                                    <img 
                                        src={product.images?.[0] || product.imageUrls?.[0] || product.image || "/img/placeholder.png"} 
                                        alt={product.name} 
                                        onError={(e) => { e.target.src = "/img/placeholder.png"; }} 
                                    />
                                </Link>
                                <div className="product-actions">
                                    <button className="action-btn" onClick={() => toggleFavorite(product)}>
                                        <svg width="20" height="20" fill={isFavorite(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: isFavorite(product.id) ? 'var(--primary-gold)' : 'inherit' }}>
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    </button>
                                    <Link to={`/urun/${product.id}`} className="action-btn">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </Link>
                                </div>
                            </div>
                            <div className="product-details">
                                <h3 className="product-title"><Link to={`/urun/${product.id}`}>{product.name || product.title}</Link></h3>
                                <div className="product-price">{product.price?.toLocaleString()} TL</div>
                            </div>
                          </div>
                    ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <h3>Ürün bulunamadı.</h3>
                        <button className="btn btn-primary" onClick={handleClearFilters}>Filtreleri Temizle</button>
                    </div>
                )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}