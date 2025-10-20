import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { OfferLineItemFormData } from '../../schemas/validationSchemas';



interface ItemRowProps {
  item: OfferLineItemFormData;
  index: number;
  isApproved: boolean;
  onSave: (index: number, data: OfferLineItemFormData) => void;
  onDelete: (index: number) => void;
  onUpdate: (index: number, data: OfferLineItemFormData) => void;
  isDraft: boolean;
  isSaving: boolean;
  errors: string[];
}

export default function ItemRow({ 
  item, 
  index, 
  isApproved, 
  onSave, 
  onDelete, 
  onUpdate,
  isDraft,
  isSaving,
  errors 
}: ItemRowProps) {
  const { control, handleSubmit, watch, setValue, formState: { errors: formErrors } } = useForm<ItemRowFormData>({
    resolver: zodResolver(itemRowSchema),
    defaultValues: item,
    mode: 'onChange'
  });

  // Watch all fields for calculations
  const watchedFields = watch();

  // Calculate totals when values change
  React.useEffect(() => {
    const { quantity, unitPrice, discountPercentage, kdv } = watchedFields;
    
    // Ara toplam hesapla
    const lineTotal = quantity * unitPrice;
    
    // İndirim hesapla
    const lineDiscount = lineTotal * (discountPercentage / 100);
    
    // KDV hesapla
    const lineVat = (lineTotal - lineDiscount) * kdv;
    
    // Toplam fiyat hesapla
    const totalPrice = lineTotal - lineDiscount + lineVat;
    
    // Hesaplanan değerleri güncelle
    setValue('lineTotal', lineTotal);
    setValue('lineDiscount', lineDiscount);
    setValue('lineVat', lineVat);
    setValue('totalPrice', totalPrice);
    
    // Parent component'e güncellenmiş veriyi gönder
    onUpdate(index, {
      ...watchedFields,
      lineTotal,
      lineDiscount,
      lineVat,
      totalPrice
    });
  }, [watchedFields.quantity, watchedFields.unitPrice, watchedFields.discountPercentage, watchedFields.kdv, setValue, index, onUpdate, watchedFields]);

  const onSubmit = (data: ItemRowFormData) => {
    onSave(index, data);
  };

  return (
    <>
      <tr>
        <td className="border border-slate-200 p-2 text-center align-middle">
          <Controller
            name="itemType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={isApproved}
                className="w-full"
              >
                <option value="Malzeme">Malzeme</option>
                <option value="Hizmet">Hizmet</option>
              </select>
            )}
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <Controller
            name="materialServiceName"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                disabled={isApproved}
                className="w-full"
                placeholder="Ad giriniz"
              />
            )}
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={0.01}
                step={0.01}
                disabled={isApproved}
                className="w-full"
                placeholder="0"
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            )}
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <Controller
            name="unitPrice"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={0}
                step={0.01}
                disabled={isApproved}
                className="w-full"
                placeholder="0"
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            )}
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <input
            type="number"
            value={watchedFields.lineTotal || 0}
            disabled
            className="w-full bg-gray-100"
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <Controller
            name="discountPercentage"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={0}
                max={100}
                step={1}
                disabled={isApproved}
                className="w-full"
                placeholder="0"
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            )}
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <Controller
            name="discountUnit"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={0}
                step={0.01}
                disabled={isApproved}
                className="w-full"
                placeholder="0"
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            )}
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <input
            type="number"
            value={watchedFields.lineDiscount || 0}
            disabled
            className="w-full bg-gray-100"
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <Controller
            name="kdv"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={isApproved}
                className="w-full"
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                <option value={0.08}>8%</option>
                <option value={0.18}>18%</option>
                <option value={0.20}>20%</option>
              </select>
            )}
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <input
            type="number"
            value={watchedFields.lineVat || 0}
            disabled
            className="w-full bg-gray-100"
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <input
            type="number"
            value={watchedFields.totalPrice || 0}
            disabled
            className="w-full bg-gray-100"
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isApproved || !isDraft || isSaving}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              isDraft 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            title={isDraft ? "Satırı Kaydet" : "Satır Kaydedildi"}
          >
            {isSaving ? 'Kaydediliyor...' : isDraft ? 'Kaydet' : 'Kaydedildi'}
          </button>
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle">
          <button
            type="button"
            onClick={() => onDelete(index)}
            disabled={isApproved}
            className="bg-red-500 text-white border-0 px-2.5 py-1 rounded-md cursor-pointer text-[16px] font-bold min-w-8 h-8 flex items-center justify-center hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Satırı Sil"
          >
            ×
          </button>
        </td>
      </tr>

      {/* Form validation errors */}
      {Object.keys(formErrors).length > 0 && (
        <tr>
          <td colSpan={12} className="border border-red-300 bg-red-50 p-2">
            <div className="text-red-600 text-sm">
              {Object.entries(formErrors).map(([field, error]) => (
                <div key={field}>• {field}: {error?.message}</div>
              ))}
            </div>
          </td>
        </tr>
      )}

      {/* Custom errors */}
      {errors.length > 0 && (
        <tr>
          <td colSpan={12} className="border border-red-300 bg-red-50 p-2">
            <div className="text-red-600 text-sm">
              {errors.map((error, errorIndex) => (
                <div key={errorIndex}>• {error}</div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}