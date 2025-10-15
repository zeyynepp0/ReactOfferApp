import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Table } from './Table';
import type { ColumnDef } from './Table';


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
}

const OfferTable: React.FC<OfferTableProps> = ({ setModalOpen, setEditingOfferId }) => {
  // Global store'dan teklifleri al
  const offers = useSelector((state: RootState) => state.offers.offers);

   const columns: ColumnDef<Offer>[] = [
    {
      header: 'Teklif No',
      fieldKey: (row, index) => index + 1 // satır numarasını göstermek için kullanılır. row.id değil, index + 1 kullanılır çünkü index sıfırdan başlar.
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
  ];

  const handleRowClick = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setModalOpen(true);
  };

  return (

    <Table<Offer>
          columns={columns}
          data={offers}
          onRowClick={handleRowClick}
          emptyDataText="Henüz teklif bulunmuyor."
    />


  
  );
};

export default OfferTable;
