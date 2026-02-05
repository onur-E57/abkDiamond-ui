import React from 'react';
import '../index.css';

export default function About() {
  return (
    <div className="container section-padding">
      
      {/* Üst Başlık */}
      <div className="section-title">
        <h2>Biz Kimiz?</h2>
        <div className="divider"></div>
      </div>

      <div className="about-container">
        
        {/* SOL: Görsel */}
        <div className="about-gallery">
          <div className="about-image-wrapper">
            <img src="/img/aboutUspic.png" alt="ABK Diamond Atölye" />
          </div>
        </div>

        {/* SAĞ: Hikaye */}
        <div className="about-info">
          <h3 className="about-title">
            Işıltının ve Zarafetin <span>Doğuşu</span>
          </h3>
          
          <div className="about-description">
            <p>
              1995 yılında Kapalıçarşı'nın mistik atmosferinde başlayan yolculuğumuz, 
              bugün ABK Diamond olarak mücevher tutkunlarına eşsiz tasarımlar sunmaya devam ediyor.
            </p>
            <br />
            <p>
              Her bir taşın kendine has bir ruhu olduğuna inanıyoruz. Usta zanaatkarlarımızın 
              ellerinde şekillenen pırlanta ve altın koleksiyonlarımız, sadece birer aksesuar değil, 
              nesilden nesile aktarılacak birer mirastır.
            </p>
            <br />
            <p>
              Modern çizgileri geleneksel işçilikle harmanlayarak, size en saf ışıltıyı sunmak için çalışıyoruz.
              Bizim için her müşteri, ABK ailesinin bir parçasıdır.
            </p>
          </div>

          {/* İstatistik Kutuları */}
          <div className="about-stats">
            <div className="stat-box">
              <span className="stat-number">25+</span>
              <p className="stat-label">Yıllık Tecrübe</p>
            </div>
            <div className="stat-box">
              <span className="stat-number">5k+</span>
              <p className="stat-label">Mutlu Müşteri</p>
            </div>
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <p className="stat-label">El İşçiliği</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}