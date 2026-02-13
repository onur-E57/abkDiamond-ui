import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');

  // 1. Giriş yapmamışsa Login'e at
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Giriş yapmış ama ADMIN değilse Ana Sayfaya at
  // NOT: Backend rolü "ADMIN" mi yoksa "ROLE_ADMIN" mi gönderiyor kontrol et.
  if (userRole !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // 3. Her şey tamamsa sayfayı göster (Outlet = Altındaki Route)
  return <Outlet />;
};

export default AdminRoute;