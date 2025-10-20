// NewOfferModal.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerSchema, type OfferFormData } from '../schemas/validationSchemas';
import Input from "./Input";
import { useOfferNew } from '../hooks/useOfferNew';

import OfferItemTable from "./OfferItemTable";

 interface NewOfferModalProps {
  setModalOpen: (value: boolean) => void;
  editingOfferId: string | null;
} 

const NewOfferModal = ({ setModalOpen, editingOfferId }: any) => {
  const { offers, addOffer, updateOffer, handleDeleteOffer,} = useOfferNew();// Tekliflerle ilgili işlemleri useOffers hook'u ile alıyoruz
  const { register, handleSubmit, formState: { errors } } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
  });

  const onSubmit = (data: OfferFormData) => {// Form gönderildiğinde çağrılır ve verileri işler veriyi kaydetmek ya da güncellemek için kullanılır
    console.log("Form Data:", data);
    addOffer(data);
    setModalOpen(false);
  };

  return (
     <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-xl w-[80%] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {editingOfferId ? 'Teklif Düzenle' : 'Yeni Teklif Ekle'}
        </h3>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Müşteri Adı" {...register("customerName")} error={errors.customerName?.message} />
      <Input label="Teklif Adı" {...register("offerName")} error={errors.offerName?.message} />
      <Input label="Tarih" type="date" {...register("offerDate")} error={errors.offerDate?.message} />
      
      <Input label="Teklif Durumu"  type="select"
        options={[
          { label: "Taslak", value: "Taslak" },
          { label: "Onay Bekliyor", value: "Onay Bekliyor" },
          { label: "Onaylandı", value: "Onaylandı" },
        ]}
        {...register("offerStatus")
        } error={errors.offerStatus?.message} />


<OfferItemTable setModalOpen={setModalOpen}
 setEditingOfferItemId={editingOfferId}
 isApproved={false}
  />

      <div className="flex justify-end gap-2">
          <button  type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg">
            Kaydet
          </button>
          
          <button
                    onClick={() => {
                      if (window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
                        handleDeleteOffer(editingOfferId);
                        
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Sil
          </button>
                
          <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">Kapat</button>
      </div>
    </form>
      </div>
    </div>
  );
};

export default NewOfferModal;
