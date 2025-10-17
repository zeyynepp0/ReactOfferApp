import React from 'react';
import { Table } from './Table';
import type { ColumnDef } from './Table';
import { useOffers } from '../hooks/useOffers';

interface OfferTableProps {
  setModalOpen: (value: boolean) => void;
  setEditingOfferId: (id: string | null) => void;
}

interface Offer {
  id: string;
  customerName: string;
  offerName: string;
  offerStatus: 'Taslak' | 'Onay Bekliyor' | 'Onaylandı'; 
  offerDate: string;
  grandTotal: number;
  isActive: boolean;
}

const OfferTable: React.FC<OfferTableProps> = ({ setModalOpen, setEditingOfferId }) => {
  const { activeOffers, softDeleteOffer } = useOffers();

  const columns: ColumnDef<Offer>[] = [
    {
      header: 'Teklif No',
      fieldKey: (_, index) => index + 1
    },
    {
      header: 'Müşteri Adı',
      fieldKey: 'customerName', 
    },
    {
      header: 'Teklif Adı',
      fieldKey: 'offerName', 
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
    },
    {
      header: 'Tarih',
      fieldKey: 'offerDate', 
    },
    {
      header: 'Toplam Tutar',
      fieldKey: 'grandTotal', 
    },
    {
      header: 'İşlemler',
      fieldKey: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingOfferId(row.id);
              setModalOpen(true);
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Düzenle
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
                softDeleteOffer(row.id);
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Sil
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setModalOpen(true);
  };

  return (
    <Table<Offer>
      columns={columns}
      data={activeOffers}
      onRowClick={handleRowClick}
      emptyDataText="Henüz teklif bulunmuyor."
    />
  );
};

export default OfferTable;
