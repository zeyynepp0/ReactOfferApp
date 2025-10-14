import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOffer, updateOffer, deleteOffer, type OfferItem, type OfferLineItem, type OfferStatus } from '../redux/offersSlice';
import type { RootState } from '../redux/store';
import { v4 as uuidv4 } from 'uuid';
import ErrorAlert from './offer-modal/ErrorAlert';
import ItemRow from './offer-modal/ItemRow';
import TotalsSummary from './offer-modal/TotalsSummary';
import { computeLineDerived, computeLiveTotals, normalizeItems } from '../utils/offerCalculations';

interface OfferModalProps {// teklif modalının props'ları
  setModalOpen: (value: boolean) => void;// modal açık/kapalı
  editingOfferId: string | null;// düzenlenecek teklifin id'si
}

const OfferModal: React.FC<OfferModalProps> = ({ setModalOpen, editingOfferId }) => {
  const dispatch = useDispatch();// redux dispatch fonksiyonu
  const offers = useSelector((state: RootState) => state.offers.offers);
  const [customerName, setCustomerName] = useState('');
  const [offerName, setOfferName] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerStatus, setOfferStatus] = useState<OfferStatus>('Taslak');
  const [items, setItems] = useState<OfferLineItem[]>([]);// teklif satırları
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());// seçilen satırların id'leri
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const isApproved = offerStatus === 'Onaylandı';

  useEffect(() => {// editingOfferId değiştiğinde çalışır
    if (editingOfferId) {// editingOfferId undefined değilse
      const offer = offers.find(o => o.id === editingOfferId);// editingOfferId ile eşleşen teklifi bulur
      if (offer) {// offer undefined değilse
        setCustomerName(offer.customerName);// müşteri adını ayarlar
        setOfferName(offer.offerName);
        setOfferDate(offer.offerDate);
        setOfferStatus(offer.offerStatus);
        setItems(normalizeItems(offer.items).map(it => ({ ...it, itemId: it.itemId || uuidv4() })));// teklif satırlarını normalize eder ve uuidv4 ile id'leri oluşturur
      }
    } else {// editingOfferId undefined ise
      // yeni teklifler için tarihi bugün olarak ayarlar
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');// günü ayarlar ve iki basamak halinde gösterir örneğin 9 değil 09 şeklinde
      setOfferDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [editingOfferId, offers]);// editingOfferId ve offers değiştiğinde çalışır

  const handleAddItem = () => {
    if (isApproved) return;
    const newItem: OfferLineItem = {
      itemId: uuidv4(),
      itemType: 'Malzeme',
      materialServiceName: '',
      quantity: 1,
      unitPrice: 0,
      discountAmount: 0,
      kdv: 0.18,
      lineTotal: 0,
      lineDiscount: 0,
      lineVat: 0,
      totalPrice: 0
    };
    setItems([...items, newItem]);//yeni satır eklenir ve react state güncellenir tablo render edilir.
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (isApproved) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const computed = computeLineDerived(newItems[index]);
    newItems[index] = { ...newItems[index], ...computed };
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    if (isApproved) return;
    const newItems = items.filter((_, i) => i !== index);//silinecek satır dışındakileri seçer newItems ekler
    setItems(newItems);// react state güncellenir tablo render edilir.
    
    // Also remove from selected items if it was selected
    const itemToDelete = items[index];
    if (itemToDelete) {// itemToDelete undefined değilse
      setSelectedItemIds(prev => {
        const newSet = new Set(prev);// önceki seçilenlerden yeni bir set oluşturur
        newSet.delete(itemToDelete.itemId);// silinecek satırın itemId'sini setten siler
        return newSet;
      });
    }
  };

  const handleSave = () => {
    // Validate
    const errors: string[] = [];
    if (!customerName.trim()) errors.push('Müşteri Adı zorunludur.');
    if (!offerName.trim()) errors.push('Teklif Adı zorunludur.');
    if (!offerDate) errors.push('Tarih zorunludur.');
    items.forEach((it, idx) => {
      const row = idx + 1;
      if (!it.materialServiceName.trim()) errors.push(`Satır ${row}: Ad zorunludur.`);
      if (/^\d+$/.test(it.materialServiceName.trim())) errors.push(`Satır ${row}: Ad sadece sayı olamaz.`);
      if (!(it.quantity > 0)) errors.push(`Satır ${row}: Miktar 0'dan büyük olmalıdır.`);
      if (it.unitPrice < 0) errors.push(`Satır ${row}: Tutar negatif olamaz.`);
      if (it.discountAmount < 0 || it.discountAmount > 100) errors.push(`Satır ${row}: İndirim % 0-100 aralığında olmalıdır.`);
    });
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors([]);

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const discountTotal = items.reduce((sum, item) => sum + item.lineDiscount, 0);
    const vatTotal = items.reduce((sum, item) => sum + item.lineVat, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOffer: OfferItem = {
      id: editingOfferId ?? uuidv4(),
      customerName,
      offerName,
      offerDate,
      offerStatus: items.length === 0 ? 'Taslak' as OfferStatus : offerStatus,
      items,
      subTotal,
      discountTotal,
      vatTotal,
      grandTotal,
    };

    if (editingOfferId) {
      dispatch(updateOffer(newOffer));
    } else {
      dispatch(addOffer(newOffer));
    }
    setModalOpen(false);
  };

  const { subTotal: liveSubTotal, discountTotal: liveDiscountTotal, vatTotal: liveVatTotal, grandTotal: liveGrandTotal } = computeLiveTotals(items, selectedItemIds);

  // Auto-adjust status when items added/removed
  useEffect(() => {
    if (items.length === 0 && offerStatus !== 'Taslak') {
      setOfferStatus('Taslak');
    }
    if (items.length > 0 && offerStatus === 'Taslak') {
      setOfferStatus('Onay Bekliyor');
    }
  }, [items, offerStatus]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-xl w-[80%] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {editingOfferId ? 'Teklif Düzenle' : 'Yeni Teklif Ekle'}
        </h3>

        <div>
          <ErrorAlert errors={formErrors} />
          <input
            type="text"
            placeholder="Müşteri Adı"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="block w-full mb-3 px-4 py-3 border border-[#ccc] rounded-lg text-[16px] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
          />
          <input
            type="text"
            placeholder="Teklif Adı"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="block w-full mb-3 px-4 py-3 border border-[#ccc] rounded-lg text-[16px] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
          />
          <input
            type="date"
            value={offerDate}
            onChange={(e) => setOfferDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="block w-full mb-3 px-4 py-3 border border-[#ccc] rounded-lg text-[16px] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]"
          />
          <select 
            value={offerStatus} 
            onChange={(e) => setOfferStatus(e.target.value as OfferStatus)} 
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
                  <th className="border border-slate-200 p-2 bg-slate-50">İndirim</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">KDV</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Toplam</th>
                  <th className="border border-slate-200 p-2 bg-slate-50">Seç</th>
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
                    onChange={handleItemChange}
                    onToggleSelect={(id) => {
                      setSelectedItemIds(prev => {
                        const next = new Set(prev);
                        if (next.has(id)) next.delete(id); else next.add(id);
                        return next;
                      });
                    }}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </tbody>
            </table>

            <button onClick={handleAddItem} className="bg-blue-500 text-white px-3 py-2 rounded-md">
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
                onClick={() => {
                  if (editingOfferId) {
                    dispatch(deleteOffer(editingOfferId));
                    setModalOpen(false);
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Sil
              </button>
            )}
            <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">Kapat</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
