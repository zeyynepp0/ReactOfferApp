// src/components/OfferTable.tsx

import React from 'react';
import { Table } from './Table';
import type { ColumnDef } from './Table'; 
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
//import type { OfferItem } from '../redux/offersSlice';
import { deleteOffer, type OfferItem } from '../redux/offersSlice';
import { toast } from 'react-toastify'

interface OfferTableProps {
  setEditingOfferId: (id: string | null) => void;
}



const OfferTable: React.FC<OfferTableProps> = ({ setEditingOfferId }) => {
  // 1. Redux'tan ham veriyi al
  const { offers } = useSelector((state: RootState) => state.offers);
  const activeOffers = offers.filter(o => o.isActive); 
  const dispatch = useDispatch();

  const handleDeleteClick = (offerId: string) => {
    if (window.confirm('Bu teklifi silmek istediğinizden emin misiniz? (Pasif hale getirilecek)')) {
      dispatch(deleteOffer(offerId));
      toast.info("Teklif silindi (pasif hale getirildi).");
    }
  };
  
  // 2. Sütun Tanımları (Filtre prop'ları ile)
  // Table.tsx'e nasıl davranacağını bu konfigürasyon ile söylüyoruz
  const columns: ColumnDef<OfferItem>[] = [
    {
      header: 'Teklif No',
      fieldKey: (_, index) => index + 1
      // filterKey yok, bu yüzden filtre render edilmez
    },
    {
      header: 'Müşteri Adı',
      fieldKey: 'customerName', 
      sortKey: 'customerName',
      filterKey: 'customerName', //  Filtrelenecek anahtar
      filterType: 'text',        // - Filtre tipi
    },
    {
      header: 'Teklif Adı',
      fieldKey: 'offerName', 
      sortKey: 'offerName',
      filterKey: 'offerName',
      filterType: 'text',
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
      filterKey: 'offerStatus', 
      filterType: 'select',
    },
    {
      header: 'Tarih',
      fieldKey: 'offerDate', 
      sortKey: 'offerDate',
      filterKey: 'offerDate', 
      filterType: 'date',
      
    },
    {
      header: 'Toplam Tutar',
      fieldKey: (row) => `${row.grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`,
      sortKey: 'grandTotal',
      
    },
    {
      header: 'İşlemler',
      fieldKey: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setEditingOfferId(row.id ?? null); }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Düzenle
          </button>
          {/* <button
            onClick={(e) => { e.stopPropagation(); console.log("Sil butonu tıklandı:", row.id); }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Sil
          </button> */}

          {row.offerStatus !== 'Onaylandı' && (
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              handleDeleteClick(row.id); // console.log yerine bu fonksiyon çağrıldı
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Sil
          </button>
          )}
        </div>
      ),
      // filterKey yok, bu yüzden filtre render edilmez
    },
  ];

  const handleRowClick = (offer: OfferItem) => {
    setEditingOfferId(offer.id ?? null);
  };

  // 3. Table bileşenini render et
  return (
    <Table
      columns={columns}
      data={activeOffers} //  Ham veriyi (sadece aktif olanları) gönder
      onRowClick={handleRowClick}
      emptyDataText="Henüz teklif bulunmuyor."
    />
  );
};

export default OfferTable;