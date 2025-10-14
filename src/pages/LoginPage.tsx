import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, checkAuth } from "../redux/authSlice";
import type { RootState } from "../redux/store";
// Tailwind used instead of CSS file

// Basit demo login sayfası (admin/123)
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Uygulama açıldığında mevcut oturum var mı kontrol et
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Giriş yapıldıysa teklif listesine yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/offers');
    }
  }, [isAuthenticated, navigate]);

  // Form gönderimi: basit kullanıcı adı/şifre kontrolü
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
    <div className="flex justify-center items-center h-screen w-screen bg-[linear-gradient(135deg,#aabed3,#fed6e3)]">
      <form className="bg-white px-10 py-10 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-[350px] max-w-[90%] text-center" onSubmit={handleSubmit}>
        <h2 className="w-[107%] mb-7 text-[#f5a1bb] text-[50px]">Login</h2>
        <input
          className="w-full p-3 my-[10px] border border-[#f5a1bb] rounded-lg text-[15px] focus:border-[#aabed3] outline-none"
          type="text"
          placeholder="Kullanıcı adı"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 my-[10px] border border-[#f5a1bb] rounded-lg text-[15px] focus:border-[#aabed3] outline-none"
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-[107%] p-3 bg-[#f5a1bb] text-white rounded-lg text-[16px] font-medium mt-[10px] transition-colors hover:bg-[#aabed3]" type="submit">Login</button>
        {error && <p className="text-rose-600 mt-2 text-sm">{error}</p>}
      </form>
    </div>
  );

}