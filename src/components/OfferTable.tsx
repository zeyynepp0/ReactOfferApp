// src/components/OfferTable.tsx

import React from 'react';
import Table from './Table';
import type { ColumnDef } from '../types/tableTypes';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
//import type { OfferItem } from '../redux/offersSlice';
import { deleteOffer, type OfferItem } from '../redux/offersSlice';
import { toast } from 'react-toastify'
import { createOfferColumns } from './columns/offerColumns';

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
  
  // 2. Sütun Tanımları modülden
  const columns: ColumnDef<OfferItem>[] = createOfferColumns({
    onEdit: setEditingOfferId,
    onDelete: handleDeleteClick,
  });

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