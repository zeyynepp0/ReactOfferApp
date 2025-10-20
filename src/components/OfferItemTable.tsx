import React, { useState } from 'react'
import { offerSchema, type OfferFormData ,type OfferLineItemFormData} from "../schemas/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
//import { useOffers } from '../hooks/useOffers';
//import { fi } from 'zod/locales';
import ItemRow from './offer-modal/ItemRow';
import TotalsSummary from './offer-modal/TotalsSummary';
//import { computeTotals } from '../utils/offerCalculations';
//import { useOfferItems } from '../hooks/useOfferItems';
import { v4 as uuidv4 } from "uuid";


interface OfferItemTableProps {
  setModalOpen: (value: boolean) => void;
  setEditingOfferItemId: (id: string | null) => void;
  isApproved: boolean;
} 

const OfferItemTable: React.FC<OfferItemTableProps> = ({ 
  setModalOpen, 
  setEditingOfferItemId, 
  isApproved 
}) => {
  
  
  const [selectedItems, setSelectedItemsId] = useState<Set<string>>(new Set());

  
  const toggleItemSelection = (itemId: string) => {
    setSelectedItemsId((prev) => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };



  //useFieldArray kurulumu
  const { control,  handleSubmit, setValue}=  useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      /* id: uuidv4(),
      customerName: '',
      offerName: '',
      offerDate: new Date().toISOString().split('T')[0],
      offerStatus: 'Taslak',
      items: items,
      subTotal: 0,
      discountTotal: 0,
      vatTotal: 0,
      grandTotal: 0,
      isActive: true */
      //başlangıç değerleri burada ayarlanıyor.
      items: []
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

const handleAddRow = () => {
  const newItem: OfferLineItemFormData = {
    itemId: uuidv4(),
    itemType: 'Malzeme',
    materialServiceName: '',
    quantity: 1,
    unitPrice: 0,
    discountAmount: 0,
    discountUnit: 0,
    discountPercentage: 0,
    kdv: 0.18,
    lineTotal: 0,
    lineDiscount: 0,
    lineVat: 0,
    totalPrice: 0,
    isActiveLine: true
  };
  append(newItem);
  };


   const handleItemChange = (index: number, field: string, value: any) => {
    setValue(`items.${index}.${field as keyof OfferLineItemFormData}`, value, {
      shouldValidate: true, // Değişiklik sonrası validasyon çalıştır
    });
  }; 

  //const onSubmit = (data: OfferLineItemFormData) => { console.log(data); };


  return (
 <>
  <table className="w-full border-collapse  mb-8">
               <thead>
                 <tr>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">Tür</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">Ad</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">Miktar</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">Tutar</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">Ara Toplam (₺)</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">İndirim (%)</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">İndirim (Birim)</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">İndirim Toplamı (₺)</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">KDV</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">KDV Toplamı</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">Toplam</th>
                   <th className="border border-slate-200 p-2 px-6 bg-slate-50">Sil</th>
                 </tr>
               </thead>
               <tbody>
                 {fields.map((field, index) => (
                   <ItemRow 
                     key={field.id}
                     item={field}
                     index={index}
                     isApproved={isApproved}
                     selected={selectedItems.has(field.itemId)}
                     onChange={handleItemChange}
                     onToggleSelect={toggleItemSelection}
                     onDelete={remove}
                   />
                 ))}
               </tbody>
             </table>
 <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={handleAddRow}
          className="bg-blue-500 text-white px-3 py-2 rounded-md"
        >
          + Satır Ekle
        </button>

      </div>  
    </>
  );
};

export default OfferItemTable;