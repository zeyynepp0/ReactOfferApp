// src/components/NewOfferModal.tsx
import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, type UseFormTrigger, type FieldErrors, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { offerSchema, type OfferFormData, type OfferLineItemFormData } from '../schemas/validationSchemas';
import Input from "./Input";
import OfferItemTable from "./OfferItemTable";
import TotalsSummary from "./offer-modal/TotalsSummary";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addOffer, updateOffer, deleteOffer } from "../redux/offersSlice";
import type { OfferItem, OfferLineItem } from "../redux/offersSlice";
import { computeTotals } from "../utils/offerCalculations";
import type { RootState } from "../redux/store";
import { toast } from 'react-toastify';
import ButtonInput from "./ButtonInput";
import Test from "./Test";

interface NewOfferModalProps {
  setModalOpen: (value: boolean) => void;
  editingOfferId: string | null;
}

const NewOfferModal = ({ setModalOpen, editingOfferId }: NewOfferModalProps) => {
  const dispatch = useDispatch();


  //react-hook-form kütüphanesinin ana hook'udur ve formunun tüm durumunu (state) yönetir.
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
    setValue,
    watch,
    reset,
    trigger,
    getValues
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    mode: "onChange",
    shouldUnregister: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
    keyName: "fieldId"
  });

  const offerToEdit = useSelector((state: RootState) => //react-redux kütüphanesinden gelen bir hook'tur ve Redux'taki global state'ten veri okumanı sağlar.
    editingOfferId ? state.offers.offers.find(offer => offer.id === editingOfferId) : undefined
  );

  const currentOfferStatus = watch("offerStatus");
  const isReadOnly = useMemo(() => currentOfferStatus === 'Onaylandı', [currentOfferStatus]);

  useEffect(() => {
    if (offerToEdit?.offerStatus === 'Onaylandı') {
      toast.info("Bu teklif onaylandığı için düzenlenemez.", { autoClose: 500 });
    }
  }, [])
  // Formu yükleme/sıfırlama
  useEffect(() => {
    if (offerToEdit) {
      reset(offerToEdit);
      // Ref kontrolü: Sadece durum Onaylandı ise VE bu ID için bildirim daha önce gösterilmediyse göster


    } else {
      const initialValues = {
        id: undefined, customerName: '', offerName: '',
        offerDate: new Date().toISOString().split('T')[0],
        offerStatus: 'Taslak' as const,
        items: [],
        subTotal: 0, discountTotal: 0, vatTotal: 0, grandTotal: 0, isActive: true
      };
      reset(initialValues);
    }
  }, [editingOfferId, offerToEdit, reset]);

  // Toplamları hesaplama (utils/computeTotals kullanarak)
  const watchedItems = watch("items", []);
  useEffect(() => {
    // Sadece geçerli (adı girilmiş) satırları hesaba kat
    const validItems = watchedItems.filter(item => item && item.materialServiceName && item.materialServiceName.trim() !== '');
    const { subTotal, discountTotal, vatTotal, grandTotal } = computeTotals(validItems as OfferLineItem[]);
    setValue("subTotal", subTotal, { shouldValidate: false });
    setValue("discountTotal", discountTotal, { shouldValidate: false });
    setValue("vatTotal", vatTotal, { shouldValidate: false });
    setValue("grandTotal", grandTotal, { shouldValidate: false });
  }, [watchedItems, setValue]);


  // Ana Kaydet/Güncelle butonu
  const onSubmit = (data: OfferFormData) => {
    if (isReadOnly && editingOfferId) {
      toast.warn("Onaylanmış teklifler üzerinde değişiklik yapılamaz!");
      return;
    }

    // Sadece adı girilmiş satırları kaydet
    const filledItems = data.items.filter(item => item.materialServiceName && item.materialServiceName.trim() !== '');

    if (filledItems.length === 0) {
      toast.error("Kaydedilemedi. Lütfen en az bir geçerli satır ekleyin.");
      return;
    }

    // Toplamları son kez utils ile hesapla
    const calculatedTotals = computeTotals(filledItems as OfferLineItem[]);

    const finalOffer: OfferItem = {
      ...data,
      id: editingOfferId || uuidv4(),
      isActive: true,
      items: filledItems.map(item => ({
        ...(item as OfferLineItemFormData),
        discountAmount: item.discountAmount ?? 0,
        itemId: item.itemId || uuidv4(),
        isActiveLine: item.isActiveLine ?? true
      })) as OfferLineItem[],
      subTotal: calculatedTotals.subTotal,
      discountTotal: calculatedTotals.discountTotal,
      vatTotal: calculatedTotals.vatTotal,
      grandTotal: calculatedTotals.grandTotal,
    };

    if (editingOfferId) {
      dispatch(updateOffer(finalOffer));
      toast.success("Teklif başarıyla güncellendi!");
    } else {
      dispatch(addOffer(finalOffer));
      toast.success("Yeni teklif başarıyla eklendi!");
    }
    setModalOpen(false);
  };

  // Silme
  const handleDelete = () => {
    if (isReadOnly) {
      toast.warn("Onaylanmış teklifler silinemez!");
      return;
    }
    if (editingOfferId && window.confirm('Bu teklifi kalıcı olarak silmek istediğinizden emin misiniz? (Pasif hale getirilecek)')) {
      dispatch(deleteOffer(editingOfferId));
      toast.info("Teklif silindi (pasif hale getirildi).");
      setModalOpen(false);
    }
  };

  // Satır ekleme
  const handleAddRow = () => {
    if (isReadOnly) {
      toast.warn("Onaylanmış teklife yeni satır eklenemez.");
      return;
    }
    const newItem: OfferLineItemFormData = {
      itemId: uuidv4(), itemType: 'Malzeme', materialServiceName: '',
      quantity: 1, unitPrice: 0,
      discountAmount: 0, // Bu alan şemada var
      discountPercentage: 0, discountUnit: 0, kdv: 0.18,
      lineTotal: 0, lineDiscount: 0, lineVat: 0, totalPrice: 0, isActiveLine: true
    };
    append(newItem);
  };

  // Satır silme
  const handleRemoveRow = (index: number) => {
    if (isReadOnly) {
      toast.warn("Onaylanmış tekliften satır silinemez.");
      return;
    }
    remove(index);
  };

  const onStatusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, onChange: (...event: any[]) => void) => {
    const newValue = e.target.value as OfferFormData['offerStatus'];
    if (newValue === "Onaylandı" && watch("items")?.length === 0) {
      toast.error("Onaylanamadı! Teklifte geçerli satır bulunmuyor.");
      return;
    }
    if (newValue === "Onaylandı") {
      handleSubmit(onSubmit)(e)
      return;
    }
    onChange(e)
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000] p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-lg">
        {/* Modal Başlığı */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-semibold">
            {editingOfferId ? 'Teklif Düzenle' : 'Yeni Teklif Ekle'}
            {isReadOnly && <span className="text-sm font-normal text-yellow-600 ml-2">(Onaylandı - Değişiklik yapılamaz)</span>}
          </h3>

        </div>

        {/* Hata Durumu Göstergesi */}
        {Object.keys(formErrors).length > 0 && !formErrors.items && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            Lütfen işaretli alanları kontrol edin.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-grow min-h-0">

          {/* Üst Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
            <Input label="Müşteri Adı" {...register("customerName")} error={formErrors.customerName?.message} disabled={isReadOnly} />
            <Input label="Teklif Adı" {...register("offerName")} error={formErrors.offerName?.message} disabled={isReadOnly} />
            <Input label="Tarih" type="date" {...register("offerDate")} error={formErrors.offerDate?.message} disabled={isReadOnly} />
            <Controller
              control={control}
              name="offerStatus"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Input label="Teklif Durumu" type="select"
                  options={[
                    { label: "Taslak", value: "Taslak" },
                    { label: "Onay Bekliyor", value: "Onay Bekliyor" },
                    { label: "Onaylandı", value: "Onaylandı" },
                  ]}
                  value={value}
                  onChange={(e) => {
                    onStatusChange(e, onChange)
                  }}
                  error={error?.message}
                  disabled={isReadOnly}
                />
              )}
            />
          </div>

          {/* Satır Tablosu Alanı */}
          <div className="flex-grow overflow-y-auto min-h-[200px]">
            <OfferItemTable
              isApproved={isReadOnly}
              control={control}
              fields={fields}
              removeRow={handleRemoveRow}
              appendRow={handleAddRow}
              setValue={setValue}
              triggerField={trigger as UseFormTrigger<OfferFormData>}
              formErrors={formErrors.items as FieldErrors<OfferLineItemFormData[]> | undefined}
            />
          </div>

          {/* Toplamlar ve Butonlar */}
          <div className="flex-shrink-0 pt-4 border-t mt-4">
            <TotalsSummary
              subTotal={watch("subTotal")}
              discountTotal={watch("discountTotal")}
              vatTotal={watch("vatTotal")}
              grandTotal={watch("grandTotal")}
            />
            <div className="flex justify-end gap-3 pt-5">

              {!isReadOnly && (
                <button type="submit" disabled={isSubmitting} className="bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                  {editingOfferId ? 'Güncelle' : 'Kaydet'}
                </button>
              )}

              {!isReadOnly && editingOfferId && (
                <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Sil
                </button>
              )}
              <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Kapat
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOfferModal;