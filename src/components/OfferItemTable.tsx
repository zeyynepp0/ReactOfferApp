// src/components/OfferItemTable.tsx
import React from 'react';
import type { Control, UseFormSetValue, UseFormTrigger, FieldArrayWithId, FieldErrors } from "react-hook-form";
import type { OfferFormData, OfferLineItemFormData } from "../schemas/validationSchemas";
import ItemRow from './offer-modal/ItemRow'; // ItemRow'u import ediyoruz

interface OfferItemTableProps {
  isApproved: boolean;
  control: Control<OfferFormData>;
  fields: FieldArrayWithId<OfferFormData, "items", "fieldId">[];
  removeRow: (index: number) => void;
  appendRow: () => void;
  setValue: UseFormSetValue<OfferFormData>;
  triggerField: UseFormTrigger<OfferFormData>;
  formErrors: FieldErrors<OfferLineItemFormData[]> | undefined;
}

const OfferItemTable: React.FC<OfferItemTableProps> = ({
  isApproved,
  control,
  fields,
  removeRow,
  appendRow,
  setValue,
  triggerField,
  formErrors 
}) => {

  return (
    <>
      {/* Tablo */}
      <div className="overflow-x-auto relative border rounded-md">
        <table className="w-full border-collapse min-w-[1200px]">
          {/* Tablo Başlıkları (thead) */}
          <thead>
            <tr className="bg-slate-100 text-sm">
              <th className="border-b border-slate-300 p-2 px-3 text-left font-semibold">Tür</th>
              <th className="border-b border-slate-300 p-2 px-3 text-left font-semibold w-1/4">Ad</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">Miktar</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">Birim Fiyat</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">Ara Top.</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">İnd.(%)</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">İnd.(Birim)</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">İnd. Top.</th>
              <th className="border-b border-slate-300 p-2 px-3 text-center font-semibold">KDV</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">KDV Top.</th>
              <th className="border-b border-slate-300 p-2 px-3 text-right font-semibold">Toplam</th>
              <th className="border-b border-slate-300 p-2 px-3 text-center font-semibold">İşlem</th>
            </tr>
          </thead>
          {/* Tablo İçeriği (tbody) */}
          <tbody>
            {fields.map((field, index) => (
              <ItemRow
                key={field.fieldId} // key olarak 'fieldId' kullanılıyor
                control={control}
                index={index}
                isApproved={isApproved}
                onDelete={() => removeRow(index)} // Parent'ın remove fonksiyonunu çağır
                setParentValue={setValue} // Parent'ın setValue'ını geçir
                triggerField={triggerField} // Parent'ın trigger'ını geçir
              />
            ))}
            {/* Eğer hiç satır yoksa bilgi mesajı */}
            {fields.length === 0 && (
                <tr>
                    <td colSpan={12} className="text-center text-gray-500 p-4 border-b border-slate-200">
                        Henüz satır eklenmedi.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Satır Ekle Butonu */}
      <div className="flex justify-start items-center mt-3">
        <button
          type="button"
          onClick={appendRow} // Parent'tan gelen append fonksiyonunu çağır
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isApproved}
        >
          + Satır Ekle
        </button>
      </div>
    </>
  );
};

export default OfferItemTable;