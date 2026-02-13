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
  const [allProducts, setAllProducts] = useState([]); // Tüm ham ürünler
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtrelenmiş ve gösterilenler
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Filtre State'leri
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); 
  const [searchText, setSearchText] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOption, setSortOption] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // useFavorites hook'unu kullanıyorsan import et, yoksa bu satırı ve aşağıdaki kullanımını kaldırabilirsin
  // const { toggleFavorite, isFavorite } = useFavorites(); 
  const { toggleFavorite, isFavorite } = useFavorites?.() || { toggleFavorite: () => {}, isFavorite: () => false };
  
  const location = useLocation();
  const sidebarRef = useRef(null);

  // --- SIDEBAR KAPATMAK İÇİN ---
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

  // --- BAŞLANGIÇ: Kategorileri ve Tüm Ürünleri Çek ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // 1. Kategorileri Al
        const catData = await getStoreCategories();
        setCategories(catData || []);

        // 2. Tüm Ürünleri Al (Mock Data'dan)
        // Mock API'mizde getFilteredProducts tüm listeyi dönüyor
        const prodData = await getFilteredProducts();
        
        // Gelen veri dizi mi yoksa obje mi (content) kontrol et
        const items = Array.isArray(prodData) ? prodData : (prodData.content || []);
        setAllProducts(items);
        setFilteredProducts(items); // Başlangıçta hepsini göster

      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // --- URL'den Kategori Seçimi ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategoryId(Number(cat)); // ID ise Number'a çevir
  }, [location.search]);

  // --- ANA FİLTRELEME MANTIĞI ---
  // Herhangi bir filtre değiştiğinde çalışır
  useEffect(() => {
    let result = [...allProducts];

    // 1. Arama Filtresi
    if (searchText) {
      const lowerText = searchText.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(lowerText)) || 
        (p.title && p.title.toLowerCase().includes(lowerText))
      );
    }

    // 2. Kategori Filtresi
    if (selectedCategoryId) {
      result = result.filter(p => p.categoryId === Number(selectedCategoryId) || p.category?.id === Number(selectedCategoryId));
    }

    // 3. Fiyat Filtresi
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

    setFilteredProducts(result);
  }, [allProducts, searchText, selectedCategoryId, priceRange, sortOption]);


  // --- BUTON FONKSİYONLARI ---
  const handleClearFilters = () => {
    setSearchText('');
    setPriceRange({ min: '', max: '' });
    setSelectedCategoryId('');
    setSortOption('default');
    setIsFilterOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 flex flex-col md:flex-row gap-8 relative">
        
        {/* MOBİL FİLTRE BUTONU */}
        <button 
          className="md:hidden w-full mb-4 bg-black text-white py-3 flex items-center justify-center gap-2 rounded mobile-filter-toggle" 
          onClick={() => setIsFilterOpen(true)}
        >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            FİLTRELE VE ARA
        </button>

        {/* --- SIDEBAR --- */}
        <aside 
          ref={sidebarRef} 
          className={`fixed md:relative top-0 left-0 h-full md:h-auto w-64 md:w-1/4 bg-white z-50 p-6 md:p-0 shadow-2xl md:shadow-none transition-transform duration-300 transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h3 className="font-bold text-lg">Filtreler</h3>
            <button className="text-2xl" onClick={() => setIsFilterOpen(false)}>&times;</button>
          </div>

          <div className="space-y-6">
            {/* Arama */}
            <div>
                <h4 className="font-bold mb-2 text-sm tracking-wider">ARA</h4>
                <input 
                  type="text" 
                  placeholder="Ürün adı ara..." 
                  className="w-full border p-2 rounded"
                  value={searchText} 
                  onChange={(e) => setSearchText(e.target.value)} 
                />
            </div>

            {/* Kategoriler */}
            <div>
                <h4 className="font-bold mb-2 text-sm tracking-wider">KATEGORİLER</h4>
                <ul className="space-y-2 text-sm">
                  <li 
                    className={`cursor-pointer hover:text-yellow-600 ${selectedCategoryId === '' ? 'font-bold text-yellow-600' : ''}`} 
                    onClick={() => setSelectedCategoryId('')}
                  >
                    Tümü
                  </li>
                  {categories.map((cat) => (
                      <li 
                        key={cat.id} 
                        className={`cursor-pointer hover:text-yellow-600 ${selectedCategoryId === cat.id ? 'font-bold text-yellow-600' : ''}`} 
                        onClick={() => setSelectedCategoryId(cat.id)}
                      >
                      {cat.name} 
                      </li>
                  ))}
                </ul>
            </div>

            {/* Fiyat */}
            <div>
                <h4 className="font-bold mb-2 text-sm tracking-wider">FİYAT ARALIĞI (TL)</h4>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-1/2 border p-2 rounded text-sm"
                        value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} />
                    <input type="number" placeholder="Max" className="w-1/2 border p-2 rounded text-sm"
                        value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} />
                </div>
            </div>

            {/* Sıralama */}
            <div>
               <h4 className="font-bold mb-2 text-sm tracking-wider">SIRALAMA</h4>
               <select className="w-full border p-2 rounded text-sm" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
               </select>
            </div>

            <button className="w-full bg-gray-200 py-2 rounded text-sm hover:bg-gray-300 transition" onClick={handleClearFilters}>
              Filtreleri Temizle
            </button>
          </div>
        </aside>

        {/* Backdrop (Mobil için) */}
        {isFilterOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsFilterOpen(false)}></div>}

        {/* --- ÜRÜN LİSTESİ --- */}
        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-end mb-6 border-b pb-4">
            <div>
              <h1 className="text-2xl font-serif">Koleksiyonumuz</h1>
              <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} ürün listeleniyor</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                          <div className="group relative" key={product.id}>
                            <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3 rounded-lg">
                                <Link to={`/urun/${product.id}`}>
                                    <img 
                                      src={product.images?.[0] || product.imageUrls?.[0] || product.image || "/img/placeholder.png"} 
                                      alt={product.name || product.title} 
                                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                      onError={(e) => { e.target.src = "/img/placeholder.png"; }} 
                                    />
                                </Link>
                                
                                {/* Hover Butonları */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                                    <button 
                                      className="bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-800"
                                      onClick={() => toggleFavorite(product)}
                                    >
                                        <svg width="18" height="18" fill={isFavorite(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: isFavorite(product.id) ? '#d4af37' : 'inherit' }}>
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-medium text-gray-900 mb-1">
                                  <Link to={`/urun/${product.id}`} className="hover:underline">{product.name || product.title}</Link>
                                </h3>
                                <div className="text-sm font-bold text-gray-700">{product.price?.toLocaleString()} TL</div>
                            </div>
                          </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded">
                        <h3 className="text-xl mb-2">Aradığınız kriterlere uygun ürün bulunamadı.</h3>
                        <p className="text-gray-500 mb-4">Lütfen filtreleri değiştirip tekrar deneyin.</p>
                        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800" onClick={handleClearFilters}>Filtreleri Temizle</button>
                    </div>
                )}
            </>
          )}
        </main>
      </div>
  );
}