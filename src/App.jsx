import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';

import ScrollToTop from './components/ScrollToTop';

import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';

import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

import Login from './pages/Login';

import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';

function App() {
  return (
    <>
      <ScrollToTop />
      <ToastContainer 
        position="bottom-center"
        transition={Slide}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
      />
        <Routes>
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="/hakkimizda" element={<><Header /><About /><Footer /></>} />
          <Route path="/urun/:id" element={<><Header /><ProductDetail /><Footer /></>} />
          <Route path="/sepet" element={<><Header /><Cart /><Footer /></>} />
          <Route path="/login" element={<><Header /><Login /><Footer /></>} />
          <Route path="/koleksiyon" element={<><Header /><Products /><Footer /></>} />
          <Route path="/favoriler" element={<><Header /><Favorites /><Footer /></>} />
          <Route path="/profil" element={<><Header /><Profile/><Footer /></>} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="urunler" replace />} />
            <Route path="urunler" element={<AdminProducts />} />
            <Route path="siparisler" element={<div>Sipariş Sayfası Yapılacak</div>} />
          </Route>
        </Routes>
    </>
  );
}

export default App;