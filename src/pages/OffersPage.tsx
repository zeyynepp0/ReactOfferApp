// src/pages/OffersPage.tsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import OfferTable from '../components/OfferTable';
import OfferModal from '../components/OfferModal';

import '../css/OfferPage.css';

const OffersPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Yeni teklif butonuna basıldığında çalışır
  const handleNewOffer = () => {
    setEditingOfferId(null);
    setModalOpen(true);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="offer-page-container">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        onNewOffer={handleNewOffer}
      />

      <div className={`offer-page-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="offer-header">
          <h2 className="offer-title">Teklif Listesi</h2>
        </div>

        <button className="new-offer-btn" onClick={handleNewOffer}>
          Yeni Teklif Ekle
        </button>

        {/* Teklif tablosu */}
        <OfferTable setModalOpen={setModalOpen} setEditingOfferId={setEditingOfferId} />

        {/* Modal penceresi */}
        {modalOpen && (
          <OfferModal
            setModalOpen={setModalOpen}
            editingOfferId={editingOfferId}
          />
        )}
      </div>
    </div>
  );
};

export default OffersPage;
