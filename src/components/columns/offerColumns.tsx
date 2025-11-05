import React from 'react';
import type { ColumnDef } from '../../types/tableTypes';
import type { OfferItem } from '../../redux/offersSlice';

interface CreateOfferColumnsArgs {
  onEdit: (id: string | null) => void;
  onDelete: (id: string) => void;
}

export function createOfferColumns({ onEdit, onDelete }: CreateOfferColumnsArgs): ColumnDef<OfferItem>[] {
  return [
    {
      header: 'Teklif No',
      fieldKey: (_, index) => index + 1,
      hideSort: true,
    },
    {
      header: 'Müşteri Adı',
      fieldKey: 'customerName',
      sortKey: 'customerName',
      filterKey: 'customerName',
      filterType: 'text',
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
      filterKey: 'grandTotal',
      filterType: 'number',
    },
    {
      header: 'İşlemler',
      hideSort: true,
      fieldKey: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(row.id ?? null); }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Düzenle
          </button>
          {row.offerStatus !== 'Onaylandı' && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Sil
            </button>
          )}
        </div>
      ),
    },
  ];
}


