import React from 'react';
// tableTypes.ts dosyasından ColumnDef tipini import ediyoruz
import type { ColumnDef } from '../../types/tableTypes'; 

// T'nin Table.tsx'teki gibi bir id'ye sahip olmasını sağlıyoruz
interface TableBodyProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  sortedData: T[];
  emptyDataText: string;
  searchTerm: string; // Arama mesajı için
  onRowClick?: (rowData: T) => void;
}

export default function TableBody<T extends { id: string | number }>(
  { columns, sortedData, emptyDataText, searchTerm, onRowClick }: TableBodyProps<T>
) {
  return (
    <tbody>
      {sortedData.length === 0 ? (
        <tr>
          <td colSpan={columns.length} className="text-center text-gray-500 p-4">
            {/* Arama terimi varsa "sonuç yok" mesajı, yoksa "veri yok" mesajı */}
            {searchTerm
              ? "Arama sonucuyla eşleşen veri bulunamadı"
              : emptyDataText
            }
          </td>
        </tr>
      ) : (
        sortedData.map((row, rowIndex) => (
          <tr
            key={row.id} // Anahtar olarak row.id kullanılıyor
            onClick={() => onRowClick && onRowClick(row)}
            className={onRowClick ? "cursor-pointer hover:bg-gray-100 transition" : ""}
          >
            {columns.map((col, colIndex) => (
              <td key={`${col.header}-${colIndex}`} className="p-3 border-b border-slate-100">
                
                {/* Hücre içeriğini render et */}
                {typeof col.fieldKey === "function"
                  ? col.fieldKey(row, rowIndex) // Fonksiyon ise çalıştır
                  : String(row[col.fieldKey as keyof T] ?? "") // Değilse değeri string olarak bas
                }
                
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}