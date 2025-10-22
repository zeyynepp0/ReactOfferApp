// src/components/OfferTable.tsx

import React from 'react';
import { Table } from './Table';
import type { ColumnDef } from './Table';
import { useSelector } from 'react-redux'; // Eklendi
import type { RootState } from '../redux/store'; // Eklendi
import type { OfferItem } from '../redux/offersSlice'; // Eklendi (OfferFormData yerine Redux tipini kullanalım)

interface OfferTableProps {
  setEditingOfferId: (id: string | null) => void;
}

const OfferTable: React.FC<OfferTableProps> = ({ setEditingOfferId }) => {
  // Redux state'inden teklifleri çek
  const { offers } = useSelector((state: RootState) => state.offers); // Eklendi
  
  // Sadece 'isActive' olan teklifleri filtrele
  const activeOffers = offers.filter(o => o.isActive); // Eklendi
  
  // Silme işlemi için useDispatch eklenebilir, ancak şimdilik focus kaydetmede.
  // const dispatch = useDispatch();
  // const { deleteOffer } = useOffers(); // Bu hook yerine Redux'taki deleteOffer kullanılmalı

  // Not: Kolon tipi olarak 'OfferItem' kullandık, bu Redux'tan gelen tiple eşleşir



  const columns: ColumnDef<OfferItem>[] = [
    {
      header: 'Teklif No',
      fieldKey: (_, index) => index + 1
    },
    {
      header: 'Müşteri Adı',
      fieldKey: 'customerName', 
      //enableSearch: true,
    },
    {
      header: 'Teklif Adı',
      fieldKey: 'offerName', 
      //enableSearch: true,
    },
    {
      header: 'Durum',
      fieldKey: (row) => (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.offerStatus === 'Taslak'
              ? 'bg-slate-100 text-slate-700'
              : row.offerStatus === 'Onay Bekliyor'
              ? 'bg-yellow-100 text-amber-800'
              : 'bg-green-100 text-green-700'
          }`}>
          {row.offerStatus}
        </span>
      ),
      sortKey: 'offerStatus',
    },
    {
      header: 'Tarih',
      fieldKey: 'offerDate', 
    },
    {
      header: 'Toplam Tutar',
      // Toplam tutarı formatlayarak gösterelim
      fieldKey: (row) => `${row.grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`,
      sortKey: 'grandTotal',
    },
    {
      header: 'İşlemler',
      fieldKey: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingOfferId(row.id ?? null);
              // setModalOpen(true); // Bu prop artık OfferPage'den yönetiliyor
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Düzenle
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Burada Redux'tan 'deleteOffer' dispatch edilmeli
              // dispatch(deleteOffer(row.id));
              console.log("Sil butonu tıklandı (Redux dispatch eklenmeli):", row.id);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Sil
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (offer: OfferItem) => {
    setEditingOfferId(offer.id ?? null);
    // setModalOpen(true); // Bu prop artık OfferPage'den yönetiliyor
  };

  return (
    <Table
      columns={columns}
      data={activeOffers} // Yorum satırı kaldırıldı ve Redux verisi bağlandı
      onRowClick={handleRowClick}
      emptyDataText="Henüz teklif bulunmuyor."
    />
  );
};

export default OfferTable;