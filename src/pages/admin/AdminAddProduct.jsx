import React, { useState, useEffect } from 'react';
import { getCategories, addProduct } from '../../api/product';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import './admin.css';

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // API JSON Formatına Uygun State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '', 
    discount: 0,
    carat: 0,
    metalType: 'Gold',
    purity: '',
    weight: 0,
    stock: 0,
    categoryId: '',
    discountEndDate: '',
    active: true
  });

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        imageUrls: [formData.imageUrl],
        discount: parseFloat(formData.discount),
        carat: parseFloat(formData.carat),
        metalType: formData.metalType,
        purity: formData.purity,
        weight: parseFloat(formData.weight),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        active: formData.active,
        discountEndDate: formData.discountEndDate ? new Date(formData.discountEndDate).toISOString() : null
      };

      await addProduct(payload);
      toast.success('Ürün başarıyla eklendi! 🚀');
      navigate('/admin/urunler');

    } catch (error) {
      console.error(error);
      toast.error('Hata: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

    const handleAddCategory = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Hızlı Kategori Ekle',
      html: '<input id="swal-input1" class="swal2-input" placeholder="Kategori Adı">',
      showCancelButton: true,
      confirmButtonText: 'Ekle',
      confirmButtonColor: '#c5a059',
      preConfirm: () => {
        return document.getElementById('swal-input1').value
      }
    });

    if (formValues) {
      try {
        await createCategory({ name: formValues, description: "-" });
        toast.success("Kategori eklendi!");
        loadData(); // Kategorileri yenile
      } catch (error) {
        toast.error("Kategori eklenemedi.");
      }
    }
    };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Yeni Ürün Ekle</h1>
      </div>

      <div className="admin-table-container p-30">
        <form onSubmit={handleSubmit}>
          
          {/* 1. BÖLÜM: Temel Bilgiler */}
          <div className="admin-grid-row grid-3">
            <div className="form-group">
              <label className="form-label">Ürün Adı *</label>
              <input type="text" className="form-control" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Fiyat (TL) *</label>
              <input type="number" className="form-control" name="price" required value={formData.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Stok Adedi *</label>
              <input type="number" className="form-control" name="stock" required value={formData.stock} onChange={handleChange} />
            </div>
          </div>

          {/* 2. BÖLÜM: Kategori ve Resim */}
          <div className="admin-grid-row grid-2-large-right">
            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select className="form-control" name="categoryId" required value={formData.categoryId} onChange={handleChange}>
                <option value="">Seçiniz</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                  <label className="form-label">Kategori *</label>
                  <small 
                      style={{color:'var(--primary-gold)', cursor:'pointer', fontWeight:600}}
                      onClick={handleAddCategory}
                  >
                      + Yeni
                  </small>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Resim URL *</label>
              <input type="text" className="form-control" name="imageUrl" placeholder="https://..." required value={formData.imageUrl} onChange={handleChange} />
            </div>
          </div>

          {/* 3. BÖLÜM: Özellikler */}
          <h4 className="form-section-title">Ürün Özellikleri</h4>
          <div className="admin-grid-row grid-4">
            <div className="form-group">
              <label className="form-label">Maden Tipi</label>
              <select className="form-control" name="metalType" value={formData.metalType} onChange={handleChange}>
                <option value="Gold">Altın (Gold)</option>
                <option value="Silver">Gümüş (Silver)</option>
                <option value="Platinum">Platin</option>
                <option value="Rose Gold">Rose Gold</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ayar / Saflık (Purity)</label>
              <input type="text" className="form-control" name="purity" placeholder="Örn: 14K, 925" value={formData.purity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Ağırlık (Gr)</label>
              <input type="number" step="0.01" className="form-control" name="weight" value={formData.weight} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Karat (Varsa)</label>
              <input type="number" step="0.01" className="form-control" name="carat" value={formData.carat} onChange={handleChange} />
            </div>
          </div>

          {/* 4. BÖLÜM: Satış Detayları */}
          <h4 className="form-section-title">Satış Detayları</h4>
          <div className="admin-grid-row grid-3-equal">
             <div className="form-group">
              <label className="form-label">İndirim Oranı (%)</label>
              <input type="number" className="form-control" name="discount" value={formData.discount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">İndirim Bitiş Tarihi</label>
              <input type="datetime-local" className="form-control" name="discountEndDate" value={formData.discountEndDate} onChange={handleChange} />
            </div>
            <div className="form-group checkbox-wrapper">
               <label className="checkbox-label">
                 <input type="checkbox" className="checkbox-input" name="active" checked={formData.active} onChange={handleChange} />
                 Sitede Yayınla (Aktif)
               </label>
            </div>
          </div>

          {/* 5. BÖLÜM: Açıklama */}
          <div className="form-group">
            <label className="form-label">Ürün Açıklaması</label>
            <textarea className="form-control" rows="4" name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>

          {/* BUTONLAR */}
          <div className="modal-footer">
             <button type="button" className="btn-cancel" onClick={() => navigate('/admin/urunler')}>İptal</button>
             <button type="submit" className="btn-submit" disabled={loading}>
               {loading ? 'Ekleniyor...' : 'Kaydet ve Yayınla'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}