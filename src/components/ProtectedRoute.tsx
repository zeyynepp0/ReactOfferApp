import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkAuthentication } = useAuth();
  const navigate = useNavigate();

  // Sayfa yüklendiğinde authentication durumunu kontrol et
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Kullanıcı giriş yapmışsa içeriği göster
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
