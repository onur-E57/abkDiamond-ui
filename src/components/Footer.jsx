import React from 'react';
import '../index.css'; // CSS bağlantısı

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        
        {/* Kolon 1: Kurumsal */}
        <div className="footer-column">
          <h3>Kurumsal</h3>
          <ul>
            <li><a href="#">Hakkımızda</a></li>
            <li><a href="#">Sıkça Sorulan Sorular</a></li>
            <li><a href="#">İnsan Kaynakları</a></li>
            <li><a href="#">İletişim</a></li>
          </ul>
        </div>

        {/* Kolon 2: Koleksiyonlar */}
        <div className="footer-column">
          <h3>Koleksiyonlar</h3>
          <ul>
            <li><a href="#">Pırlanta Yüzükler</a></li>
            <li><a href="#">Altın Kolyeler</a></li>
            <li><a href="#">Zümrüt Küpeler</a></li>
            <li><a href="#">Özel Tasarımlar</a></li>
          </ul>
        </div>

        {/* Kolon 3: Müşteri Hizmetleri */}
        <div className="footer-column">
          <h3>Yardım</h3>
          <ul>
            <li><a href="#">Teslimat Koşulları</a></li>
            <li><a href="#">İade ve Değişim</a></li>
            <li><a href="#">Gizlilik Politikası</a></li>
            <li><a href="#">Ödeme Seçenekleri</a></li>
          </ul>
        </div>

        {/* Kolon 4: İletişim & Bülten */}
        <div className="footer-column footer-contact">
          <h3>Bize Ulaşın</h3>
          <p>
            <strong>Adres:</strong> Kapalıçarşı, İstanbul<br/>
            <strong>Tel:</strong> +90 545 455 5554<br/>
            <strong>Email:</strong> info@abkdiamond.com
          </p>
          
          <div className="newsletter-form">
            <input type="email" placeholder="E-posta adresiniz" />
            <button>→</button>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ABK Diamond. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}