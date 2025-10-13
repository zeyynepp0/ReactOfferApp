import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, checkAuth } from "../redux/authSlice";
import type { RootState } from "../redux/store";
import "../css/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/offers');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // (örnek: admin / 123)
    if (email === "admin" && password === "123") {
      const user = {
        id: "1",
        username: "admin",
        email: "admin@example.com"
      };
      const token = "fake-jwt-token-" + Date.now();
      
      // Redux store'a login bilgilerini kaydet
      dispatch(login({ user, token }));
      
      // localStorage'a kaydet
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      //alert("Giriş başarılı!");
      navigate("/offers"); 
    } else {
      setError("Kullanıcı adı veya şifre hatalı!");
    }
};


return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  
  );

}