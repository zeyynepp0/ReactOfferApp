import React from 'react';
import { Table } from './Table';
import type { ColumnDef } from './Table';
//import { useOffers } from '../hooks/useOffers';
import { offerSchema, type OfferFormData } from '../schemas/validationSchemas';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface OfferTableProps {
  setModalOpen: (value: boolean) => void;
  setEditingOfferId: (id: string | null) => void;
}

const OfferTable: React.FC<OfferTableProps> = ({ setModalOpen, setEditingOfferId }) => {
  //const { activeOffers, softDeleteOffer } = useOffers();

  const { register, handleSubmit, formState: { errors } } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
  });
  


  const columns: ColumnDef<OfferFormData>[] = [
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
              setEditingOfferId(row.id ?? null);
              //setModalOpen(true);
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Düzenle
          </button>
          <button
           
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Sil
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = (offer: OfferFormData) => {
    setEditingOfferId(offer.id ?? null);
    //setModalOpen(true);
  };

  return (
    <Table
      columns={columns}
      //data={activeOffers}
      onRowClick={handleRowClick}
      emptyDataText="Henüz teklif bulunmuyor."
    />
  );
};

export default OfferTable;
