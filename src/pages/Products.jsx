import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Sayfalama State'leri
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filtre State'leri
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
  const [searchText, setSearchText] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();
  const location = useLocation();

  // --- SIDEBAR KAPATMAK İÇİN REF
  const sidebarRef = useRef(null);

  // --- SONSUZ KAYDIRMA İÇİN GÖZLEMCİ (OBSERVER) ---
  const observer = useRef();
  
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // --- SIDEBAR KAPATMAK İÇİN USEFFECT
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Eğer menü açıksa VE tıklanan yer Sidebar'ın içinde DEĞİLSE
      if (isFilterOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        
        // ÖNEMLİ: Eğer tıklanan yer "FİLTRELE VE ARA" butonuysa işlemi durdur.
        // (Çünkü o butona basınca zaten açılması/kapanması lazım, çakışmasın)
        if (!event.target.closest('.mobile-filter-toggle')) {
           setIsFilterOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);


  // Kategorileri Çek
  useEffect(() => {
    getStoreCategories().then(data => setCategories(data || [])).catch(console.error);
  }, []);

  // URL'den Kategori Seçimi (Link ile gelirse)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategoryId(cat);
  }, [location.search]);

  // Ürünleri Çek (Sayfa veya Filtre Değişince)
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const payload = {
          page: page,
          size: 12,
          sort: sortOption
        };

        if (selectedCategoryId) payload.categoryId = selectedCategoryId;
        if (searchText) payload.name = searchText;
        if (priceRange.min) payload.minPrice = parseFloat(priceRange.min);
        if (priceRange.max) payload.maxPrice = parseFloat(priceRange.max);

        const data = await getFilteredProducts(payload);
        
        const newItems = Array.isArray(data) ? data : (data.content || []);

        setProducts(prev => {
          return page === 0 ? newItems : [...prev, ...newItems];
        });

        setHasMore(newItems.length === 12);

      } catch (error) {
        console.error("Yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, selectedCategoryId, searchText, priceRange, sortOption]);

  // --- BUTON FONKSİYONLARI ---

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setProducts([]);
    setHasMore(true);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setPriceRange({ min: '', max: '' });
    setSelectedCategoryId('');
    setSortOption('default');
    setPage(0);
    setProducts([]);
    setHasMore(true);
  };

  const getSortedProducts = () => {
    let sorted = [...products];
    if (sortOption === 'price_asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price_desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortOption === 'name_asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  };
  
  const displayedProducts = getSortedProducts();

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

          {loading && products.length === 0 ? (
            <div className="loading-spinner">💎 Yükleniyor...</div>
          ) : (
            <>
                {displayedProducts.length > 0 ? (
                    <div className="product-grid">
                    {displayedProducts.map((product, index) => {
                        const isLastElement = displayedProducts.length === index + 1;
                        return (
                          <div className="product-card" key={product.id} ref={isLastElement ? lastProductElementRef : null}>
                            <div className="product-image">
                                <Link to={`/urun/${product.id}`}>
                                    <img src={product.imageUrls?.[0] || "/img/placeholder.png"} alt={product.name} 
                                         onError={(e) => { e.target.src = "/img/placeholder.png"; }} />
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
                                <h3 className="product-title"><Link to={`/urun/${product.id}`}>{product.name}</Link></h3>
                                <div className="product-price">{product.price?.toLocaleString()} TL</div>
                            </div>
                          </div>
                        );
                    })}
                    </div>
                ) : (
                    <div className="no-products">
                        <h3>Ürün bulunamadı.</h3>
                        <button className="btn btn-primary" onClick={handleClearFilters}>Filtreleri Temizle</button>
                    </div>
                )}

                {loading && products.length > 0 && (
                   <div className="loading-spinner text-center" style={{padding:'20px'}}>💎 Daha fazla yükleniyor...</div>
                )}
                {!hasMore && products.length > 0 && (
                   <div className="text-center" style={{padding:'20px', color:'#999'}}>— Tüm ürünleri gördünüz —</div>
                )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}