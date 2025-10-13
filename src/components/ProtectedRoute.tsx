import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { checkAuth } from '../redux/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Sayfa yüklendiğinde authentication durumunu kontrol et
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Kullanıcı giriş yapmışsa içeriği göster
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
