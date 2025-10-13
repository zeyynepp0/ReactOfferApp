import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
//import type { OfferLineItem } from '../redux/offersSlice';
import '../css/OfferTable.css';

interface OfferTableProps {
  setModalOpen: (value: boolean) => void;
  setEditingOfferId: (id: string | null) => void;
}

const OfferTable: React.FC<OfferTableProps> = ({ setModalOpen, setEditingOfferId }) => {
  const offers = useSelector((state: RootState) => state.offers.offers);

  return (
    <div className="offer-table-container">
      <table className="offer-table">
        <thead>
          <tr>
            <th>Teklif No</th>
            <th>Müşteri Adı</th>
            <th>Teklif Adı</th>
            <th>Durum</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>
          {offers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 p-4">
                Henüz teklif bulunmuyor.
              </td>
            </tr>
          ) : (
            offers.map((offer, index) => (
              <tr
                key={offer.id}
                className="cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  setEditingOfferId(offer.id);
                  setModalOpen(true);
                }}
              >
                <td>{index + 1}</td>
                <td>{offer.customerName}</td>
                <td>{offer.offerName}</td>
                <td>
                  <span className={`status-pill status-${offer.offerStatus.replace(' ', '-').toLowerCase()}`}>
                    {offer.offerStatus}
                  </span>
                </td>
                <td>{offer.offerDate}</td>
               
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfferTable;
