import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    getAdminProducts, 
    deleteProduct, 
    getCategories,
    updateProduct
} from '../../api/product';
import { toast } from 'react-toastify'; 
import './admin.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Sadece Düzenleme için Modal State'leri
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catData, prodData] = await Promise.all([
          getCategories(),
          getAdminProducts()
      ]);
      setCategories(catData || []);
      setProducts(Array.isArray(prodData) ? prodData : []);
    } catch (error) {
      console.error(error);
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // --- SİLME İŞLEMİ ---
  const handleDelete = async (id) => {
    if (window.confirm("Bu ürünü silmek istediğine emin misin?")) {
      try {
        await deleteProduct(id);
        toast.success("Ürün silindi.");
        loadData();
      } catch (error) {
        toast.error("Silinemedi.");
      }
    }
  };

  // --- DÜZENLEME MODALINI AÇ ---
  const handleOpenEdit = (product) => {
    // Kategori ID'sini güvenli şekilde bul
    const catId = product.categoryId || (product.category?.id) || (typeof product.category === 'string' ? product.category : '');

    setEditForm({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: catId,
        imageUrl: product.imageUrls?.[0] || product.imageUrl || '',
        active: product.active
    });
    setSelectedProductId(product.id);
    setIsEditModalOpen(true);
  };

  // --- GÜNCELLEME İŞLEMİ ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        await updateProduct({
            id: selectedProductId,
            ...editForm,
            imageUrls: [editForm.imageUrl]
        });
        toast.success("Ürün başarıyla güncellendi! ✨");
        setIsEditModalOpen(false);
        loadData();
    } catch (error) {
        toast.error("Güncellenemedi: " + (error.response?.data?.message || error.message));
    }
  };

  // Helper: Kategori İsmi
  const getCategoryName = (product) => {
    if (product.category?.name) return product.category.name;
    const catId = product.categoryId || (typeof product.category === 'string' ? product.category : null);
    if (catId) {
        const foundCat = categories.find(c => c.id === catId);
        if (foundCat) return foundCat.name;
    }
    return "-";
  };

  return (
    <div className="admin-page">
      
      {/* BAŞLIK VE YENİ EKLE BUTONU */}
      <div className="admin-page-header">
        <h1 className="admin-title">Ürün Yönetimi</h1>
        {/* ARTIK MODAL YOK, DİREKT SAYFAYA GİDİYOR */}
        <Link to="/admin/urun-ekle" className="btn-admin-primary" style={{textDecoration:'none'}}>
          <span>+</span> Yeni Ürün Ekle
        </Link>
      </div>

      {/* TABLO */}
      <div className="admin-table-container">
        {loading ? (
            <div className="loading-state">Yükleniyor...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th width="80">Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Durum</th>
                <th className="cell-actions">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.imageUrls?.[0] || product.imageUrl || "/img/placeholder.png"} 
                      alt="" 
                      className="product-thumb"
                    />
                  </td>
                  <td className="cell-product-name">{product.name}</td>
                  <td>
                    <span className="badge-category">{getCategoryName(product)}</span>
                  </td>
                  <td className="cell-price">
                    {product.price?.toLocaleString()} TL
                  </td>
                  <td>
                    {product.active ? 
                        <span className="status-active">Aktif</span> : 
                        <span className="status-passive">Pasif</span>
                    }
                  </td>
                  <td className="cell-actions">
                    <div className="actions-wrapper">
                        {/* DÜZENLE BUTONU */}
                        <button 
                            className="btn-icon btn-edit" 
                            title="Düzenle"
                            onClick={() => handleOpenEdit(product)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        
                        {/* SİL BUTONU */}
                        <button 
                            className="btn-icon btn-delete" 
                            title="Sil"
                            onClick={() => handleDelete(product.id)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="empty-state">Kayıtlı ürün bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* DÜZENLEME MODALI */}
      {isEditModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Ürünü Düzenle</h3>
                    <button className="btn-close" onClick={() => setIsEditModalOpen(false)}>&times;</button>
                </div>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label className="form-label">Ürün Adı</label>
                        <input 
                            className="form-control" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})} 
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Fiyat</label>
                            <input 
                                className="form-control" 
                                type="number" 
                                value={editForm.price} 
                                onChange={e => setEditForm({...editForm, price: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Kategori</label>
                            <select 
                                className="form-control"
                                value={editForm.categoryId}
                                onChange={e => setEditForm({...editForm, categoryId: e.target.value})}
                            >
                                <option value="" disabled>Seçiniz</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Resim URL</label>
                        <input 
                            className="form-control" 
                            value={editForm.imageUrl} 
                            onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} 
                        />
                    </div>
                    
                    <div className="form-group checkbox-wrapper">
                       <label className="checkbox-label">
                         <input 
                            type="checkbox" 
                            className="checkbox-input"
                            checked={editForm.active} 
                            onChange={e => setEditForm({...editForm, active: e.target.checked})} 
                         />
                         Sitede Yayınla (Aktif)
                       </label>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn-submit">Güncelle</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}