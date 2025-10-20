// src/components/offer-modal/ItemRow.tsx

import React, { useEffect } from 'react';
// useWatch, Controller ve tipler import ediliyor
import { Controller, useWatch, type Control, type UseFormSetValue, type UseFormTrigger, type FieldErrors } from 'react-hook-form';
// offerLineItemSchema artık burada kullanılmıyor (validasyon Controller veya ana formda)
import { type OfferFormData, type OfferLineItemFormData } from '../../schemas/validationSchemas';
import { toast } from 'react-toastify';
import { FaTrash } from "react-icons/fa";
interface ItemRowProps {
  control: Control<OfferFormData>;
  index: number;
  isApproved: boolean;
  onDelete: () => void; // Sadece index'siz silme fonksiyonu (OfferItemTable'da index ile çağrılacak)
  setParentValue: UseFormSetValue<OfferFormData>;
  triggerField: UseFormTrigger<OfferFormData>;
  // formErrors?: FieldErrors<OfferLineItemFormData>; // Opsiyonel: Hataları toplu almak isterseniz
}

export default function ItemRow({
  control,
  index,
  isApproved,
  onDelete, // Direkt removeRow(index) çağrısını alan fonksiyon
  setParentValue,
  triggerField,
  // formErrors // Kaldırıldı, Controller içinden alınacak
}: ItemRowProps) {

  // İzlenecek alanları belirle (sadece hesaplama için gerekenler + materialServiceName)
  const [
      quantity, unitPrice, discountPercentage, discountUnit, kdv,
      // Hesaplanan değerleri de izle (useEffect karşılaştırması için)
      currentLineTotal, currentLineDiscount, currentLineVat, currentTotalPrice,
      materialServiceName // Silme onayı için
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
    const numQuantity = Number(quantity) || 0;
    const numUnitPrice = Number(unitPrice) || 0;
    const numDiscountPercentage = Number(discountPercentage) || 0;
    const numDiscountUnit = Number(discountUnit) || 0;
    const numKdv = Number(kdv) || 0.18;

    const newLineTotal = numQuantity * numUnitPrice;
    const newLineDiscount = newLineTotal * (numDiscountPercentage / 100) + numDiscountUnit;
    const baseForVat = Math.max(0, newLineTotal - newLineDiscount);
    const newLineVat = baseForVat * numKdv;
    const newTotalPrice = baseForVat + newLineVat;

    // Sadece değişen hesaplanmış alanları ana forma yaz
    if (currentLineTotal !== newLineTotal) {
      setParentValue(`items.${index}.lineTotal`, newLineTotal, { shouldValidate: false, shouldDirty: true, shouldTouch: true });
    }
    if (currentLineDiscount !== newLineDiscount) {
      setParentValue(`items.${index}.lineDiscount`, newLineDiscount, { shouldValidate: false, shouldDirty: true, shouldTouch: true });
    }
    if (currentLineVat !== newLineVat) {
      setParentValue(`items.${index}.lineVat`, newLineVat, { shouldValidate: false, shouldDirty: true, shouldTouch: true });
    }
    if (currentTotalPrice !== newTotalPrice) {
      setParentValue(`items.${index}.totalPrice`, newTotalPrice, { shouldValidate: false, shouldDirty: true, shouldTouch: true });
    }

  }, [
    quantity, unitPrice, discountPercentage, discountUnit, kdv, // İzlenen inputlar
    index, setParentValue, // Sabit veya stabil referanslar
    // Hesaplanan değerleri de ekleyerek karşılaştırma için useEffect'in tekrar çalışmasını sağla
    currentLineTotal, currentLineDiscount, currentLineVat, currentTotalPrice
  ]);


  // Satır Validasyonu
  const handleRowValidate = async () => { /* ... önceki haliyle aynı ... */ };

  // Satır Silme (Onay ve Bildirim ile)
  const handleRowDelete = () => {
    const itemName = materialServiceName || 'İsimsiz';
    if (window.confirm(`Satır ${index + 1}: "${itemName}" silinecek. Emin misiniz?`)) {
      onDelete(); // Parent'tan gelen removeRow(index)'i çağıracak
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
              <div> {/* Hata mesajını alta almak için div */}
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
            {!isApproved && ( <button type="button" onClick={handleRowDelete} className="p-1 text-red-600 hover:text-red-800" title="Satırı Sil"> <svg className="w-5 h-1"  /> Sil</button> )}
          </div>
        </td>
      </tr>
      {/* Hata mesajları artık Controller içinde render ediliyor */}
    </>
  );
}