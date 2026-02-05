import React, { useState, useEffect } from 'react';
import { 
    getAdminProducts, 
    addProduct, 
    deleteProduct, 
    getCategories, 
    createCategory,
    updateProduct // Yeni fonksiyonu import ettik
} from '../../api/product';
import { toast } from 'react-toastify'; 
import Swal from 'sweetalert2'; 
import './admin.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Modal ve Düzenleme Durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const initialFormState = {
    name: '',
    price: '',
    categoryId: '', 
    imageUrl: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormState);

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
      console.error("Veri hatası:", error);
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // --- EKLEME MODUNU AÇ ---
  const handleOpenAddModal = () => {
    setFormData(initialFormState); // Formu temizle
    // Varsayılan kategori seçimi
    if (categories.length > 0) {
        setFormData(prev => ({...prev, categoryId: categories[0].id}));
    }
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // --- DÜZENLEME MODUNU AÇ ---
  const handleOpenEditModal = (product) => {
    // Kategori ID'sini bulmaya çalışıyoruz (Backend v1/v2 karışıklığı için)
    const catId = product.categoryId || (product.category?.id) || (typeof product.category === 'string' ? product.category : '');

    setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: catId,
        // Backend array dönüyor, biz string olarak formda gösteriyoruz (ilk resim)
        imageUrl: product.imageUrls?.[0] || product.imageUrl || ''
    });

    setSelectedProductId(product.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // --- MODAL KAPAT ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  // --- KAYDET / GÜNCELLE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.categoryId) {
      return toast.warn("Lütfen zorunlu alanları doldurun.");
    }

    const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || "Açıklama yok.",
        categoryId: formData.categoryId,
        imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
        
        // Sabit değerler (Backend zorunlu tutuyorsa)
        stock: 100,           
        metalType: "Gold",    
        purity: "14K",        
        weight: 0,            
        active: true          
    };

    try {
        if (isEditMode) {
            // GÜNCELLEME (PUT)
            await updateProduct({ 
                id: selectedProductId, // ID'yi eklemeyi unutmuyoruz
                ...payload 
            });
            toast.success("Ürün başarıyla güncellendi! ✨");
        } else {
            // YENİ EKLEME (POST)
            await addProduct(payload);
            toast.success("Ürün başarıyla eklendi! 🎉");
        }

        handleCloseModal();
        loadData(); // Tabloyu yenile

    } catch (error) {
        console.error("İşlem hatası:", error);
        toast.error("İşlem başarısız: " + (error.response?.data?.message || error.message));
    }
  };

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

  // Hızlı Kategori Ekleme
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
      
      {/* BAŞLIK VE EKLE BUTONU */}
      <div className="admin-page-header">
        <h1 className="admin-title">Ürün Yönetimi</h1>
        <button className="btn-admin-primary" onClick={handleOpenAddModal}>
          <span>+</span> Yeni Ürün Ekle
        </button>
      </div>

      {/* TABLO */}
      <div className="admin-table-container">
        {loading ? (
            <div style={{padding:'40px', textAlign:'center'}}>Yükleniyor...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th width="80">Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th style={{textAlign: 'right'}}>İşlemler</th>
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
                  <td style={{fontWeight:500}}>{product.name}</td>
                  <td>
                    <span className="badge-category">{getCategoryName(product)}</span>
                  </td>
                  <td style={{fontWeight:'bold', color:'var(--primary-gold)'}}>
                    {product.price?.toLocaleString()} TL
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        {/* DÜZENLE BUTONU */}
                        <button 
                            className="btn-icon btn-edit" 
                            title="Düzenle"
                            onClick={() => handleOpenEditModal(product)}
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
                <tr><td colSpan="5" style={{padding:'30px', textAlign:'center', color:'#999'}}>Kayıtlı ürün bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL (POP-UP FORM) */}
      {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">
                        {isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                    </h3>
                    <button className="btn-close" onClick={handleCloseModal}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Ürün Adı *</label>
                        <input 
                            className="form-control"
                            type="text" 
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                        <div className="form-group">
                            <label className="form-label">Fiyat (TL) *</label>
                            <input 
                                className="form-control"
                                type="number" 
                                required 
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <label className="form-label">Kategori *</label>
                                <small 
                                    style={{color:'var(--primary-gold)', cursor:'pointer', fontWeight:600}}
                                    onClick={handleAddCategory}
                                >
                                    + Yeni
                                </small>
                            </div>
                            <select 
                                className="form-control"
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
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
                            type="text" 
                            placeholder="https://..."
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Açıklama</label>
                        <textarea 
                            className="form-control"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={handleCloseModal}>İptal</button>
                        <button type="submit" className="btn-submit">
                            {isEditMode ? 'Güncelle' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}