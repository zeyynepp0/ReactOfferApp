import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';


export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/offers');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // (admin/123)
    if (email === "admin" && password === "123") {
      const user = {
        id: "1",
        username: "admin",
        email: "admin@example.com"
      };
      const token = "fake-jwt-token-" + Date.now();
      
      loginUser({ user, token });
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate("/offers");
    } else {
      // Handle login error - this will be handled by validation
      throw new Error("Kullanıcı adı veya şifre hatalı!");
    }
  }, [email, password, loginUser, navigate]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    resetForm,
  };
};
