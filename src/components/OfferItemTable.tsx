// src/components/OfferItemTable.tsx

import React from 'react';
// useFieldArray kaldırıldı, çünkü ana component'te
// Gerekli tipleri import et
import type { Control, UseFormSetValue, UseFormTrigger, FieldArrayWithId, FieldErrors } from "react-hook-form";
import type { OfferFormData, OfferLineItemFormData } from "../schemas/validationSchemas";
import ItemRow from './offer-modal/ItemRow'; // ItemRow'u import ediyoruz

interface OfferItemTableProps {
  isApproved: boolean;
  control: Control<OfferFormData>;
  // useFieldArray'den gelen fields dizisi
  fields: FieldArrayWithId<OfferFormData, "items", "fieldId">[];
  // Satır silme fonksiyonu (parent'tan gelen)
  removeRow: (index: number) => void;
  // Satır ekleme fonksiyonu (parent'tan gelen)
  appendRow: () => void; // Parametre almasına gerek yok
  // Ana formun setValue fonksiyonu (ItemRow'a geçilecek)
  setValue: UseFormSetValue<OfferFormData>;
  // Ana formun trigger fonksiyonu (ItemRow'a geçilecek)
  triggerField: UseFormTrigger<OfferFormData>;
  // Ana formun items hataları (ItemRow'a geçilecek)
  formErrors: FieldErrors<OfferLineItemFormData[]> | undefined;
}

const OfferItemTable: React.FC<OfferItemTableProps> = ({
  isApproved,
  control,
  fields, // fields prop olarak alındı
  removeRow, // removeRow prop olarak alındı
  appendRow, // appendRow prop olarak alındı
  setValue, // setValue prop olarak alındı
  triggerField, // triggerField prop olarak alındı
  formErrors // formErrors prop olarak alındı
}) => {

  // Kendi useFieldArray hook'u kaldırıldı.
  // handleAddRow ve handleRemoveRow fonksiyonları kaldırıldı.

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
            {/* fields dizisini map ile dönerek her satır için ItemRow oluştur */}
            {fields.map((field, index) => (
              <ItemRow
                key={field.fieldId} // key olarak 'fieldId' kullanılıyor (NewOfferModal'da belirttik)
                control={control}
                index={index}
                isApproved={isApproved}
                // onDelete prop'u ItemRow'un handleRowDelete'ini tetikler, o da removeRow'u çağırır
                onDelete={() => removeRow(index)} // Doğrudan parent'ın remove fonksiyonunu çağır
                setParentValue={setValue} // Parent'ın setValue'ını geçir
                triggerField={triggerField} // Parent'ın trigger'ını geçir
                // ItemRow artık kendi hatalarını Controller içinden alacak, formErrors'a gerek yok
                // formErrors={formErrors?.[index]} // İsteğe bağlı: Hataları toplu göstermek isterseniz
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