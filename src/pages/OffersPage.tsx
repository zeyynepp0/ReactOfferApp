import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import OfferTable from '../components/OfferTable';
import OfferModal from '../components/OfferModal';



const OffersPage: React.FC = () => {
 
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Yeni teklif butonuna basıldığında çalışır
  const handleNewOffer = () => {
    setEditingOfferId(null);
    setModalOpen(true);
  };

  // Kenar menüyü aç/kapa
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-[linear-gradient(135deg,#aabed3,#fed6e3)] relative">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        onNewOffer={handleNewOffer}
      />

      <div className={`${sidebarOpen ? 'ml-[240px]' : 'ml-0'} flex-1 p-6 overflow-y-auto transition-[margin-left] duration-300`}>
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Teklif Listesi</h2>
        </div>

        <button className="fixed top-6 right-6 bg-[#fed6e3] text-[#333] px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-[#fdd1dc] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1000]" onClick={handleNewOffer}>
          Yeni Teklif Ekle
        </button>

        {/* Teklif tablosu */}
        <OfferTable setModalOpen={setModalOpen} setEditingOfferId={setEditingOfferId} />

        {/* Modal penceresi */}
        {modalOpen && (
          <OfferModal setModalOpen={setModalOpen} editingOfferId={editingOfferId}/>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
