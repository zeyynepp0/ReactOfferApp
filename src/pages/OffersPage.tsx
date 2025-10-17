import React from 'react';
import Sidebar from '../components/Sidebar';
import OfferTable from '../components/OfferTable';
import OfferModal from '../components/OfferModal';
import { useSidebar } from '../hooks/useSidebar';
import { useModal } from '../hooks/useModal';

const OffersPage: React.FC = () => {// OffersPage bileşeni
  const { isOpen: sidebarOpen, toggleSidebar } = useSidebar();// sidebar durumunu yönetmek için useSidebar hook'unu kullanıyoruz
  const { isOpen: modalOpen, editingId: editingOfferId, openForCreate, openForEdit, closeModal } = useModal();// modal durumunu yönetmek için useModal hook'unu kullanıyoruz

  return (
    <div className="flex h-screen w-screen bg-[linear-gradient(135deg,#aabed3,#fed6e3)] relative">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onNewOffer={openForCreate}
      />

      <div className={`${sidebarOpen ? 'ml-[240px]' : 'ml-0'} flex-1 p-6 overflow-y-auto transition-[margin-left] duration-300`}>
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-xl font-semibold text-center">Teklif Listesi</h2>
        </div>

        <button 
          className="fixed top-2 right-6 bg-[#fed6e3] text-[#333] px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-[#fdd1dc] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1000]" 
          onClick={openForCreate}
        >
          Yeni Teklif Ekle
        </button>

        <OfferTable 
          setModalOpen={(open) => open ? openForCreate() : closeModal()} // modal açma kapama fonksiyonu
          setEditingOfferId={(id) => id ? openForEdit(id) : closeModal()} // düzenlenen teklif id'sini ayarlama fonksiyonu
        />

        {modalOpen && (
          <OfferModal 
            setModalOpen={(open) => open ? openForCreate() : closeModal()} 
            editingOfferId={editingOfferId} 
          />
        )}
      </div>
    </div>
  );
};

export default OffersPage;