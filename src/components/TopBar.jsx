import React from 'react';
import '../index.css';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="ticker-wrapper">
        <div className="ticker-content">
            
          {/* Veriler */}
          <span>USD: 34.20 TL</span>
          <span className="divider">|</span>
          
          <span>EUR: 37.50 TL</span>
          <span className="divider">|</span>
          
          <span>SAR: 11.70 TL</span>
          <span className="divider">|</span>
          
          <span>GRAM ALTIN: 2.950 TL</span>
          <span className="divider">|</span>
          
          <span>ÇEYREK ALTIN: 4.800 TL</span>
          <span className="divider">|</span>
          
          <span>BİST 100: 9.800</span>

        </div>
      </div>
    </div>
  );
}