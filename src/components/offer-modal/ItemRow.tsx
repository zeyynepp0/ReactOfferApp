// src/components/offer-modal/ItemRow.tsx
import React, { useEffect } from 'react';
import { Controller, useWatch, type Control, type UseFormSetValue, type UseFormTrigger } from 'react-hook-form';
import { type OfferFormData, type OfferLineItemFormData } from '../../schemas/validationSchemas';
import { toast } from 'react-toastify';
import { FaTrash } from "react-icons/fa";
// Hesaplama fonksiyonunu utils'den import et
import { computeLineDerived } from '../../utils/offerCalculations';
import type { OfferLineItem, KDV } from '../../redux/offersSlice'; // KDV tipini de al

interface ItemRowProps {
  control: Control<OfferFormData>;
  index: number;
  isApproved: boolean;
  onDelete: () => void;
  setParentValue: UseFormSetValue<OfferFormData>;
  triggerField: UseFormTrigger<OfferFormData>;
}

export default function ItemRow({
  control,
  index,
  isApproved,
  onDelete,
  setParentValue,
}: ItemRowProps) {

  // İzlenecek alanları belirle
  const [
      quantity, unitPrice, discountPercentage, discountUnit, kdv,
      currentLineTotal, currentLineDiscount, currentLineVat, currentTotalPrice,
      materialServiceName
  ] = useWatch({
      control,
      name: [
          `items.${index}.quantity`, `items.${index}.unitPrice`,
          `items.${index}.discountPercentage`, `items.${index}.discountUnit`, `items.${index}.kdv`,
          `items.${index}.lineTotal`, `items.${index}.lineDiscount`, `items.${index}.lineVat`, `items.${index}.totalPrice`,
          `items.${index}.materialServiceName`
      ]
  });

  // Sayı formatlama
  const formatNumber = (value: any): string => {
      const num = Number(value);
      return (isNaN(num) ? 0 : num).toFixed(2);
  };

  // Hesaplamalar ve Ana Formu Güncelleme
  useEffect(() => {
    // computeLineDerived fonksiyonunu kullanmak için bir OfferLineItem taslağı oluştur
    const itemForCalc: OfferLineItem = {
        quantity: Number(quantity) || 0,
        unitPrice: Number(unitPrice) || 0,
        discountPercentage: Number(discountPercentage) || 0,
        discountUnit: Number(discountUnit) || 0,
        kdv: (Number(kdv) || 0.18) as KDV,
        // Fonksiyonun tipini karşılamak için gerekli diğer alanlar
        itemId: '', // Gerçek ID'ye gerek yok, sadece hesaplama için
        itemType: 'Malzeme',
        materialServiceName: '',
        discountAmount: 0, // Bu alan şemada var ama formda kullanılmıyor
        lineTotal: 0,
        lineDiscount: 0,
        lineVat: 0,
        totalPrice: 0,
        isActiveLine: true
    };

    // Hesaplamayı utils fonksiyonu ile yap
    const { lineTotal, lineDiscount, lineVat, totalPrice } = computeLineDerived(itemForCalc);

    // Sadece değişen hesaplanmış alanları ana forma yaz
    // shouldDirty: true -> formun değiştiğini RHF'e bildirir
    if (currentLineTotal !== lineTotal) {
      setParentValue(`items.${index}.lineTotal`, lineTotal, { shouldValidate: false, shouldDirty: true });
    }
    if (currentLineDiscount !== lineDiscount) {
      setParentValue(`items.${index}.lineDiscount`, lineDiscount, { shouldValidate: false, shouldDirty: true });
    }
    if (currentLineVat !== lineVat) {
      setParentValue(`items.${index}.lineVat`, lineVat, { shouldValidate: false, shouldDirty: true });
    }
    if (currentTotalPrice !== totalPrice) {
      setParentValue(`items.${index}.totalPrice`, totalPrice, { shouldValidate: false, shouldDirty: true });
    }

  }, [
    quantity, unitPrice, discountPercentage, discountUnit, kdv, // İzlenen inputlar
    index, setParentValue,
    currentLineTotal, currentLineDiscount, currentLineVat, currentTotalPrice // Değişiklik kontrolü için
  ]);


  // Satır Silme (Onay ve Bildirim ile)
  const handleRowDelete = () => {
    const itemName = materialServiceName || 'İsimsiz';
    if (window.confirm(`Satır ${index + 1}: "${itemName}" silinecek. Emin misiniz?`)) {
      onDelete(); // Parent'tan gelen remove(index) fonksiyonunu çağırır
      toast.info(`Satır ${index + 1} silindi.`);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 text-sm">
        {/* Tür */}
        <td className="border-b border-slate-200 p-2 align-top">
           <Controller name={`items.${index}.itemType`} control={control} render={({ field }) => ( <select {...field} disabled={isApproved} className="w-full border rounded px-2 py-1 text-xs"> <option value="Malzeme">Malzeme</option> <option value="Hizmet">Hizmet</option> </select> )}/>
        </td>
        {/* Ad */}
        <td className="border-b border-slate-200 p-2 align-top">
          <Controller name={`items.${index}.materialServiceName`} control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input {...field} type="text" disabled={isApproved} className={`w-full border rounded px-2 py-1 ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ad giriniz" />
                {error && <span className="text-red-500 text-xs block mt-1">{error.message}</span>}
              </div>
            )}
          />
        </td>
        {/* Miktar */}
        <td className="border-b border-slate-200 p-2 align-top">
           <Controller name={`items.${index}.quantity`} control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input {...field} value={field.value ?? ''} type="number" min={0.01} step="any" disabled={isApproved} className={`w-20 border rounded px-2 py-1 text-right ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                {error && <span className="text-red-500 text-xs block mt-1">{error.message}</span>}
              </div>
            )}
          />
        </td>
         {/* Birim Fiyat */}
        <td className="border-b border-slate-200 p-2 align-top">
           <Controller name={`items.${index}.unitPrice`} control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input {...field} value={field.value ?? ''} type="number" min={0} step="any" disabled={isApproved} className={`w-24 border rounded px-2 py-1 text-right ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                {error && <span className="text-red-500 text-xs block mt-1">{error.message}</span>}
              </div>
            )}
          />
        </td>
        {/* Ara Toplam (Hesaplanan) */}
        <td className="border-b border-slate-200 p-2 align-top text-right pr-2">
          {formatNumber(currentLineTotal)}
        </td>
        {/* İndirim (%) */}
        <td className="border-b border-slate-200 p-2 align-top">
          <Controller name={`items.${index}.discountPercentage`} control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input {...field} value={field.value ?? ''} type="number" min={0} max={100} step={1} disabled={isApproved} className={`w-16 border rounded px-2 py-1 text-right ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                {error && <span className="text-red-500 text-xs block mt-1">{error.message}</span>}
               </div>
            )}
          />
        </td>
        {/* İndirim (Birim) */}
        <td className="border-b border-slate-200 p-2 align-top">
          <Controller name={`items.${index}.discountUnit`} control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input {...field} value={field.value ?? ''} type="number" min={0} step="any" disabled={isApproved} className={`w-20 border rounded px-2 py-1 text-right ${error ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                {error && <span className="text-red-500 text-xs block mt-1">{error.message}</span>}
              </div>
            )}
          />
        </td>
         {/* İndirim Toplamı (Hesaplanan) */}
        <td className="border-b border-slate-200 p-2 align-top text-right pr-2">
           {formatNumber(currentLineDiscount)}
        </td>
        {/* KDV */}
        <td className="border-b border-slate-200 p-2 align-top text-center">
          <Controller name={`items.${index}.kdv`} control={control}
            render={({ field }) => ( <select {...field} disabled={isApproved} className="w-full border rounded px-1 py-1 text-xs" value={field.value ?? 0.18} onChange={(e) => field.onChange(Number(e.target.value))}> <option value={0.08}>8%</option> <option value={0.18}>18%</option> <option value={0.20}>20%</option> </select> )}/>
        </td>
        {/* KDV Toplamı (Hesaplanan) */}
        <td className="border-b border-slate-200 p-2 align-top text-right pr-2">
           {formatNumber(currentLineVat)}
        </td>
        {/* Toplam (Hesaplanan) */}
        <td className="border-b border-slate-200 p-2 align-top text-right pr-2 font-semibold">
          {formatNumber(currentTotalPrice)}
        </td>
        {/* İşlemler */}
        <td className="border-b border-slate-200 p-2 align-top text-center">
          <div className="flex gap-1 justify-center">
            {/* Sil Butonu */}
            {!isApproved && ( 
              <button 
                type="button" 
                onClick={handleRowDelete} 
                className="p-1 text-red-600 hover:text-red-800 flex items-center" 
                title="Satırı Sil"
              >
                <FaTrash className="w-4 h-4 inline mr-1" /> Sil
              </button> 
            )}
          </div>
        </td>
      </tr>
    </>
  );
}