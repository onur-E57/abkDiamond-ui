import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import '../index.css';



export default function Profile() {

  const navigate = useNavigate();
  
  const diamondIcon =  
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>;

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
        
        toast.info(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Başarıyla çıkış yapıldı. Tekrar bekleriz! {diamondIcon}
          </div>
        );
        
        navigate('/'); 
      }
    });
  };


    return (
        <div className="container section-padding page-padding-top-custom-profilePage">
            <div className="profile-layout">
                <div className="section-title">
                    <h2>Hesabım</h2>
                    <div className="divider"></div>
                    <p className="profile-section-subtitle">Hoş geldiniz. Hesabınızı ve siparişlerinizi buradan yönetebilirsiniz.</p>
                </div>

                <div className="profile-menu-container">
                    <ul className="profile-menu-list">
                        
                        <li>
                        <Link to="/siparislerim" className="profile-menu-link">
                            <span className="icon">📦</span> Siparişlerim
                            <span className="arrow">›</span>
                        </Link>
                        </li>

                        <li>
                        <Link to="/favoriler" className="profile-menu-link">
                            <span className="icon">❤️</span> Favorilerim
                            <span className="arrow">›</span>
                        </Link>
                        </li>

                        <li>
                        <Link to="/adreslerim" className="profile-menu-link">
                            <span className="icon">📍</span> Adreslerim
                            <span className="arrow">›</span>
                        </Link>
                        </li>

                        <li>
                        <Link to="/kartlarim" className="profile-menu-link">
                            <span className="icon">💳</span> Kayıtlı Kartlarım
                            <span className="arrow">›</span>
                        </Link>
                        </li>

                        <li>
                        <Link to="/hesap-ayarlari" className="profile-menu-link">
                            <span className="icon">⚙️</span> Hesap Ayarlarım
                            <span className="arrow">›</span>
                        </Link>
                        </li>

                        <li>
                        <Link to="/yardim" className="profile-menu-link">
                            <span className="icon">❓</span> Yardım & Destek
                            <span className="arrow">›</span>
                        </Link>
                        </li>

                        <li className="profile-logout">
                            <button onClick={handleLogout} className="user-menu-link logout">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'10px'}}>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Çıkış Yap
                            </button>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    );
}