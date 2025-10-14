import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

interface OfferTableProps {
  setModalOpen: (value: boolean) => void;
  setEditingOfferId: (id: string | null) => void;
}

const OfferTable: React.FC<OfferTableProps> = ({ setModalOpen, setEditingOfferId }) => {
  // Global store'dan teklifleri al
  const offers = useSelector((state: RootState) => state.offers.offers);

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)] overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-slate-200 p-3 text-left font-semibold">Teklif No</th>
            <th className="bg-slate-200 p-3 text-left font-semibold">Müşteri Adı</th>
            <th className="bg-slate-200 p-3 text-left font-semibold">Teklif Adı</th>
            <th className="bg-slate-200 p-3 text-left font-semibold">Durum</th>
            <th className="bg-slate-200 p-3 text-left font-semibold">Tarih</th>
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
                <td className="p-3 border-b border-slate-100">{index + 1}</td>
                <td className="p-3 border-b border-slate-100">{offer.customerName}</td>
                <td className="p-3 border-b border-slate-100">{offer.offerName}</td>
                <td className="p-3 border-b border-slate-100">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    offer.offerStatus === 'Taslak'
                      ? 'bg-slate-100 text-slate-700'
                      : offer.offerStatus === 'Onay Bekliyor'
                      ? 'bg-yellow-100 text-amber-800'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {offer.offerStatus}
                  </span>
                </td>
                <td className="p-3 border-b border-slate-100">{offer.offerDate}</td>
               
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfferTable;
