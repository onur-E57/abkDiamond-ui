import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './admin.css';

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { name: 'Ürün Yönetimi', path: '/admin/urunler', icon: '💎' },
    { name: 'Siparişler', path: '/admin/siparisler', icon: '📦' },
    { name: 'Siteye Dön', path: '/', icon: '🏠' },
  ];

  return (
    <div className="admin-layout">
      
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">
          ABK Panel
        </h2>
        <ul className="admin-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="admin-menu-item">
              <Link 
                to={item.path}
                className={`admin-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* SAĞ İÇERİK ALANI */}
      <main className="admin-content">
        <div className="admin-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}