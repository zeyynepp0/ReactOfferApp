import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ErrorAlert from './offer-modal/ErrorAlert';
import ItemRow from './offer-modal/ItemRow';
import TotalsSummary from './offer-modal/TotalsSummary';
import { offerSchema, type OfferFormData } from '../schemas/validationSchemas';
import ValidationAlert from './ValidationAlert';
import { useValidation } from '../hooks/useValidation';
import { useOffers } from '../hooks/useOffers';
import { useOfferForm } from '../hooks/useOfferForm';

interface OfferModalProps {
  setModalOpen: (value: boolean) => void;
  editingOfferId: string | null;
}

const OfferModal: React.FC<OfferModalProps> = ({ setModalOpen, editingOfferId }) => {
  const { offers, addNewOffer, updateExistingOffer, softDeleteOffer, softDeleteOfferLine } = useOffers();
  const { errors, validate, clearErrors } = useValidation({ autoCloseDelay: 7000 });
  
  const {// useOfferForm'dan gerekli state ve fonksiyonları alıyoruz
    customerName,
    setCustomerName,
    offerName,
    setOfferName,
    offerDate,
    setOfferDate,
    offerStatus,
    setOfferStatus,
    items,
    selectedItemIds,
    isApproved,
    liveSubTotal,
    liveDiscountTotal,
    liveVatTotal,
    liveGrandTotal,
    addItem,
    updateItem,
    deleteItem,
    toggleItemSelection,
    calculateTotals,
  } = useOfferForm(editingOfferId, offers);// editingOfferId ve offers'ı useOfferForm'a geçiriyoruz

  const handleSave = () => {
    clearErrors();

    const { subTotal, discountTotal, vatTotal, grandTotal } = calculateTotals();// Güncel toplamları hesapla

    const offerData: OfferFormData = {// Teklif verilerini oluşturuyoruz 
      id: editingOfferId ?? uuidv4(),
      customerName,
      offerName,
      offerDate,
      offerStatus: items.length === 0 ? 'Taslak' as const : offerStatus,
      items,
      subTotal,
      discountTotal,
      vatTotal,
      grandTotal,
      isActive: true,
    };// Teklif verilerini oluşturuyoruz

    const validation = validate(offerSchema, offerData);
    
    if (!validation.success) {
      return;
    }

    const newOffer = {
      id: editingOfferId ?? uuidv4(),
      customerName,
      offerName,
      offerDate,
      offerStatus: items.length === 0 ? 'Taslak' as const : offerStatus,
      items,
      subTotal,
      discountTotal,
      vatTotal,
      grandTotal,
      isActive: true,
    };// Yeni teklifi oluştur

    if (editingOfferId) {// Eğer düzenleme modundaysa mevcut teklifi güncelle
      updateExistingOffer(newOffer);
    } else {
      addNewOffer(newOffer);
    }
    setModalOpen(false);
  };

  const handleDeleteOffer = () => {
    if (editingOfferId && window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      softDeleteOffer(editingOfferId);
      setModalOpen(false);
    }
  };

  const handleDeleteItem = (index: number) => {
    if (isApproved) return;
    const itemToDelete = items[index];
    if (itemToDelete && editingOfferId) {
      softDeleteOfferLine({ 
        offerId: editingOfferId, 
        itemId: itemToDelete.itemId 
      });
    }
    deleteItem(index);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-xl w-[80%] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {editingOfferId ? 'Teklif Düzenle' : 'Yeni Teklif Ekle'}
        </h3>

        <div>
          <ErrorAlert errors={[]} />
          
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Müşteri Adı
          </label>
          <input
            type="text"
            placeholder="Müşteri Adı"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="block w-full mb-3 px-4 py-3 border border-[#ccc] rounded-lg text-[16px] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
          />

          <label className="block mb-1 text-sm font-medium text-gray-700">
           Teklif Adı
          </label>
          <input
            type="text"
            placeholder="Teklif Adı"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="block w-full mb-3 px-4 py-3 border border-[#ccc] rounded-lg text-[16px] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
          />
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Tarih
          </label>
          <input
            type="date"
            value={offerDate}
            onChange={(e) => setOfferDate(e.target.value)}
            className="block w-full mb-3 px-4 py-3 border border-[#ccc] rounded-lg text-[16px] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
          />
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Teklif Durumu
          </label>
          <select 
            value={offerStatus} 
            onChange={(e) => setOfferStatus(e.target.value as any)} 
            disabled={isApproved}
            className="block w-full mb-3 px-4 py-3 border border-[#ccc] rounded-lg text-[16px] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] disabled:bg-gray-100"
          >
            <option value="Taslak">Taslak</option>
            <option value="Onay Bekliyor">Onay Bekliyor</option>
            <option value="Onaylandı">Onaylandı</option>
          </select>

          <div>
            <table className="w-full border-collapse table-fixed mb-4">
              <thead>
                <tr>
                  <th className="border border-slate-200 p-2 bg-slate-50">Tür</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Ad</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Miktar</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Tutar</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Ara Toplam (₺)</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">İndirim (%)</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">İndirim (Birim)</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">İndirim Toplamı(₺)</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">KDV</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">KDV Toplamı</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Toplam</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Sil</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <ItemRow 
                    key={item.itemId}
                    item={item}
                    index={i}
                    isApproved={isApproved}
                    selected={selectedItemIds.has(item.itemId)}
                    onChange={updateItem}
                    onToggleSelect={toggleItemSelection}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </tbody>
            </table>

            <button onClick={addItem} className="bg-blue-500 text-white px-3 py-2 rounded-md">
              + Satır Ekle
            </button>

            <TotalsSummary
              subTotal={liveSubTotal}
              discountTotal={liveDiscountTotal}
              vatTotal={liveVatTotal}
              grandTotal={liveGrandTotal}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={handleSave} className="bg-emerald-500 text-white px-4 py-2 rounded-md">Kaydet</button>
            {editingOfferId && (
              <button
                onClick={handleDeleteOffer}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Sil
              </button>
            )}
            <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">Kapat</button>
          </div>
        </div>
      </div>
      
      <ValidationAlert 
        errors={errors} 
        onClose={clearErrors}
        autoClose={true}
        autoCloseDelay={7000}
      />
    </div>
  );
};

export default OfferModal;
