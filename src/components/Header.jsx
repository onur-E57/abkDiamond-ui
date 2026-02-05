import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import '../index.css';
import { useCart } from '../context/CartContext';
import api from '../api/axiosConfig';
import { getFilteredProducts } from '../api/product';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);

  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const diamondIcon =  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>;

  const isHomePage = location.pathname === '/';
  

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  //REFRESH TOKEN USAGE
  const fetchUserProfile = async () => {
  try {
    const response = await api.get('/user/profile'); 
    console.log(response.data);
  } catch (error) {
    console.error("Hata:", error);
  }
};

useEffect(() => {
    const delayDebounce = setTimeout(async () => {
        if (searchQuery.length >= 2) { // En az 2 harf yazınca ara
            setIsSearching(true);
            try {
                // API'ye "name" parametresiyle istek atıyoruz
                const data = await getFilteredProducts({ name: searchQuery });
                setSearchResults(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Arama hatası:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    }, 500); // 500ms bekle

    return () => clearTimeout(delayDebounce);
}, [searchQuery]);

// SCROLL DİNLEYİCİSİ (GÜNCELLENMİŞ VERSİYON)
    useEffect(() => {
    // Eğer Ana Sayfada DEĞİLSEK, header hep dolu (scrolled) olsun ve işlem bitsin.
    if (!isHomePage) {
      setScrolled(true);
      return; 
    }

    // Sadece Ana Sayfa için scroll dinleyicisi
    const handleScroll = () => {
      // 100px'den fazla aşağı inilirse scrolled true olsun
      setScrolled(window.scrollY > 100);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    
    // Temizlik (Cleanup)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [isSearchOpen]);


    //LOGIN CHECKLEME
    useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener('auth-change', checkLogin);

    return () => {
      window.removeEventListener('auth-change', checkLogin);
    };
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert("Arama yapılıyor... (Backend bağlanacak)");
    setIsSearchOpen(false);
  };

  // Çıkış Yap Fonksiyonu ========>
  const handleLogout = () => {
    Swal.fire({
      title: 'Çıkış Yapılıyor',
      text: "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c5a059',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, Çıkış Yap',
      cancelButtonText: 'Vazgeç',
      background: '#1a1a1a',
      color: '#fff',
      iconColor: '#c5a059'
    }).then((result) => {

      if (result.isConfirmed) {
        localStorage.removeItem('token'); 
        window.dispatchEvent(new Event("auth-change")); 
        setIsUserMenuOpen(false);
        
        toast.info(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Başarıyla çıkış yapıldı. Tekrar bekleriz! {diamondIcon}
          </div>
        );
        
        navigate('/'); 
      }
    });
  };

  const navLinks = (
    <ul>
      <li><Link to="/" onClick={() => setIsNavOpen(false)}>Ana Sayfa</Link></li>
      <li><Link to="/koleksiyon" onClick={() => setIsNavOpen(false)}>Koleksiyon</Link></li>
      <li><Link to="/hakkimizda" onClick={() => setIsNavOpen(false)}>Hakkımızda</Link></li>
    </ul>
  );
  
  return (
  <>
    <header className={`${scrolled || !isHomePage ? 'scrolled' : ''} ${isNavOpen ? 'nav-open' : ''}`}>      
      <div className="container">
        
        {/* ========== LOGO ==========  */}
        <Link to="/" className="logo" aria-label="Ana Sayfa">
          ABK <span>DIAMOND</span>
        </Link>

        <nav className={`desktop-nav ${isSearchOpen ? 'hidden' : ''}`}>
          {navLinks}
        </nav>

        <div 
          className={`nav-backdrop ${isNavOpen ? 'active' : ''}`} 
          onClick={() => setIsNavOpen(false)}
        >
        </div>

          {/* B) Arama Inputu ve Sonuçlar */}
        <div className={`header-inline-search ${isSearchOpen ? 'active' : ''}`}>

          {/* INPUT ALANI */}
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Koleksiyonlarımızda arayın..." 
            className="inline-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* KAPAT BUTONU */}
          <button 
            type="button" 
            className="inline-search-close"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            title="Aramayı Kapat"
          >
            &times;
          </button>

          {/* --- ARAMA SONUÇLARI DROPDOWN (YENİ EKLENEN KISIM) --- */}
          {searchQuery.length >= 2 && (
            <div className="search-results-dropdown">
              {isSearching ? (
                  <div className="search-loading">Arıyor...</div>
              ) : (
                  searchResults.length > 0 ? (
                      <ul>
                          {searchResults.slice(0, 5).map(product => (
                              <li key={product.id}>
                                  <Link 
                                      to={`/urun/${product.id}`} 
                                      onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                      }}
                                      className="search-result-item"
                                  >
                                      <img 
                                          src={product.imageUrls?.[0] || "/img/placeholder.png"} 
                                          alt={product.name} 
                                      />
                                      <div className="search-result-info">
                                          <span className="result-name">{product.name}</span>
                                          <span className="result-price">{product.price?.toLocaleString()} TL</span>
                                      </div>
                                  </Link>
                              </li>
                          ))}
                          <li className="search-view-all">
                              <Link to={`/koleksiyon`} onClick={() => setIsSearchOpen(false)}>
                                  Tüm Sonuçları Gör ({searchResults.length})
                              </Link>
                          </li>
                      </ul>
                  ) : (
                      <div className="search-no-result">Ürün bulunamadı.</div>
                  )
              )}
            </div>
          )}
        </div>

        <aside className={`mobile-menu-drawer ${isNavOpen ? 'active' : ''}`}>
          <button 
              className="nav-close-btn" 
              onClick={() => setIsNavOpen(false)}
              aria-label="Menüyü Kapat"
            >
              &times;
          </button>
          {navLinks}

          {/* --- MOBİL İÇİN TEMA SWITCH --- */}
          <div className="mobile-theme-control">
            <span>Görünüm Modu</span>
            
            <div 
              className="theme-switch" 
              onClick={toggleTheme} 
              role="button"
              tabIndex={0}
              style={{ margin: 0 }}
            >
              <div className="switch-handle">
                {theme === 'light' ? (
                  <svg className="switch-icon-svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg className="switch-icon-svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </aside>
        
        <div className="header-icons">
          {/* MASAÜSTÜ TEMA SWITCH (Mobilde CSS ile gizlenir) */}
            <div className="theme-switch" onClick={toggleTheme}>
              <div className="switch-handle">
                {theme === 'light' ? (
                  <svg className="switch-icon-svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                ) : (
                  <svg className="switch-icon-svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
              </div>
            </div>

          <button aria-label="Arama" onClick={() => setIsSearchOpen(true)} >
            <svg width="20" height="20" fill="currentColor"><use href="/sprite.svg#search-icon" /></svg>
          </button>

          {/* --- KULLANICI MENÜSÜ --- */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              
              <button 
                aria-label="Kullanıcı Menüsü" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`user-menu-btn ${isLoggedIn ? 'logged-in' : ''}`}
              >
                 <svg width="20" height="20" fill="currentColor"><use href="/sprite.svg#login-icon" /></svg>
              </button>

              {/* Açılır Menü */}
              <div className={`user-dropdown ${isUserMenuOpen ? 'active' : ''}`}>
                
                {isLoggedIn ? (
                  // --- GİRİŞ YAPMIŞ KULLANICI ---
                  <>

                  {/* 
                    ----YÖNETİM PANELİ GEÇİCİ OLARAK DEVRE DIŞI

                    <Link to="/admin/urunler" className="user-menu-link" onClick={() => setIsUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'10px'}}>
                        <path d="M6 3h12l4 6-10 13L2 9z"></path>
                      </svg>
                      Yönetim Paneli
                    </Link>
                  */}

                    <Link to="/favoriler" className="user-menu-link" onClick={() => setIsUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'10px'}}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      Favorilerim
                    </Link>

                    <Link to="/profil" className="user-menu-link" onClick={() => setIsUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'10px'}}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profilim
                    </Link>

                    <button onClick={handleLogout} className="user-menu-link logout">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'10px'}}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  // --- MİSAFİR KULLANICI ---
                  <>
                    <Link to="/login" className="user-menu-link" onClick={() => setIsUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'10px'}}>
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                          <polyline points="10 17 15 12 10 7"></polyline>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      Giriş Yap
                    </Link>

                    <Link to="/login" className="user-menu-link" onClick={() => setIsUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'10px'}}>
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                      </svg>
                      Kayıt Ol
                    </Link>
                  </>
                )}
                
              </div>
            </div>

          <Link to="/sepet" className="header-icon-link" aria-label="Sepetim">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          <button className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)} aria-label="Menü">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="4" x2="21" y2="4"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="20" x2="21" y2="20"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>    
  </>
  );
}