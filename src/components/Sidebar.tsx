import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import '../css/Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  onNewOffer?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onLogout, onNewOffer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (path: string) => {
    navigate(path);
    onToggle(); // Close sidebar after navigation
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    if (onLogout) onLogout();
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
      >
        ☰
      </button>
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Teklif Yönetimi</h2>
          <button className="sidebar-close" onClick={onToggle}>×</button>
        </div>
        
        <ul className="sidebar-menu">
          <li 
            className="sidebar-item active"
            onClick={() => handleNavigate('/offers')}
          >
            Teklifler
          </li>
          <li 
            className="sidebar-item new-offer"
            onClick={() => {
              if (onNewOffer) onNewOffer();
              onToggle();
            }}
          >
            Teklif Ver
          </li>
        </ul>
        
        <div className="sidebar-bottom">
          <ul className="sidebar-menu-bottom">
            <li
              className="sidebar-item logout"
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
