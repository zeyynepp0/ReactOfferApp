import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
// Tailwind used instead of CSS file

// Sidebar bileşeni: gezinme, yeni teklif açma ve çıkış işlemlerini içerir
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  onNewOffer?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onLogout, onNewOffer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Belirtilen sayfaya git ve menüyü kapat
  const handleNavigate = (path: string) => {
    navigate(path);
    onToggle();
  };

  // Çıkış işlemi: redux + localStorage temizliği ve giriş sayfasına yönlendirme
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    if (onLogout) onLogout();
  };

  return (
    <>
      {/* Aç/Kapat düğmesi */}
      <button 
        className={`${isOpen ? 'left-[260px] opacity-0 invisible' : 'left-5'} fixed top-3 z-[1001] bg-[#1e293b] text-white border-0 p-[10px] rounded-lg cursor-pointer text-[18px] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-[#334155]`}
        onClick={onToggle}
      >
        ☰
      </button>
      
      {/* Kenar menü */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-screen w-[240px] bg-[linear-gradient(135deg,#aabed3,#fed6e3)] text-black flex flex-col p-6 pb-6 transition-transform duration-300 z-[1000] shadow-[2px_0_10px_rgba(0,0,0,0.1)]`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-bold text-center flex-1">Teklif Yönetimi</h2>
          <button className="bg-transparent border-0 text-black text-2xl cursor-pointer p-0 w-[30px] h-[30px] flex items-center justify-center rounded transition-colors hover:bg-[rgba(255,255,255,0.2)]" onClick={onToggle}>×</button>
        </div>
        
        <ul className="list-none p-0 m-0 flex-1">
          <li 
            className="px-4 py-3 rounded-lg cursor-pointer transition-colors mb-2 bg-[rgba(255,255,255,0.3)]"
            onClick={() => handleNavigate('/offers')}
          >
            Teklifler
          </li>
          <li 
            className="px-4 py-3 rounded-lg cursor-pointer transition-colors mb-2 bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
            onClick={() => {
              if (onNewOffer) onNewOffer();
              onToggle();
            }}
          >
            Teklif Ver
          </li>
        </ul>
        
        <div className="mt-auto mb-10">
          <ul className="list-none p-0 m-0">
            <li
              className="px-4 py-3 rounded-lg cursor-pointer transition-colors mb-2 text-red-600 border-t border-[rgba(0,0,0,0.1)] pt-4 mt-4"
              onClick={handleLogout}
            >
              Çıkış Yap
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
