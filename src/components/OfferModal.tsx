import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOffer, updateOffer, deleteOffer, type OfferItem, type OfferLineItem, type ItemType, type OfferStatus } from '../redux/offersSlice';
import type { RootState } from '../redux/store';
import { v4 as uuidv4 } from 'uuid';
import '../css/OfferModal.css';

interface OfferModalProps {
  setModalOpen: (value: boolean) => void;
  editingOfferId: string | null;
}

const OfferModal: React.FC<OfferModalProps> = ({ setModalOpen, editingOfferId }) => {
  const dispatch = useDispatch();
  const offers = useSelector((state: RootState) => state.offers.offers);
  const [customerName, setCustomerName] = useState('');
  const [offerName, setOfferName] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerStatus, setOfferStatus] = useState<OfferStatus>('Taslak');
  const [items, setItems] = useState<OfferLineItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [focusedInputs, setFocusedInputs] = useState<Set<string>>(new Set());

  const isApproved = offerStatus === 'Onaylandı';

  const getInputId = (itemIndex: number, field: string) => `${itemIndex}-${field}`;

  const getDisplayValue = (itemIndex: number, field: string, value: number) => {
    const inputId = getInputId(itemIndex, field);
    if (focusedInputs.has(inputId) && value === 0) {
      return '';
    }
    return value.toString();
  };

  const handleFocus = (itemIndex: number, field: string) => {
    const inputId = getInputId(itemIndex, field);
    setFocusedInputs(prev => new Set(prev).add(inputId));
  };

  const handleBlur = (itemIndex: number, field: string) => {
    const inputId = getInputId(itemIndex, field);
    setFocusedInputs(prev => {
      const newSet = new Set(prev);
      newSet.delete(inputId);
      return newSet;
    });
  };

  useEffect(() => {
    if (editingOfferId) {
      const offer = offers.find(o => o.id === editingOfferId);
      if (offer) {
        setCustomerName(offer.customerName);
        setOfferName(offer.offerName);
        setOfferDate(offer.offerDate);
        setOfferStatus(offer.offerStatus);
        // Normalize existing items to ensure computed fields are present
        const normalizedItems = offer.items.map((it: OfferLineItem) => {
          const quantity = typeof it.quantity === 'number' ? it.quantity : Number(it.quantity) || 0;
          const unitPrice = typeof it.unitPrice === 'number' ? it.unitPrice : Number(it.unitPrice) || 0;
          const discountPercent = typeof it.discountAmount === 'number' ? it.discountAmount : Number(it.discountAmount) || 0;
          const kdv = typeof it.kdv === 'number' ? it.kdv : 0.18;

          const lineTotal = quantity * unitPrice;
          const lineDiscount = lineTotal * (discountPercent / 100);
          const lineVat = (lineTotal - lineDiscount) * kdv;
          const totalPrice = lineTotal - lineDiscount + lineVat;

          return {
            ...it,
            itemId: it.itemId || uuidv4(),
            quantity,
            unitPrice,
            discountAmount: discountPercent,
            kdv,
            lineTotal: typeof it.lineTotal === 'number' ? it.lineTotal : lineTotal,
            lineDiscount: typeof it.lineDiscount === 'number' ? it.lineDiscount : lineDiscount,
            lineVat: typeof it.lineVat === 'number' ? it.lineVat : lineVat,
            totalPrice: typeof it.totalPrice === 'number' ? it.totalPrice : totalPrice,
          };
        });
        setItems(normalizedItems);
      }
    } else {
      // Default the date to today's local date for new offers
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setOfferDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [editingOfferId, offers]);

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
    setItems([...items, newItem]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    if (isApproved) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const item = newItems[index];
    const lineTotal = item.quantity * item.unitPrice;
    const discountPercent = (typeof item.discountAmount === 'number' ? item.discountAmount : Number(item.discountAmount)) || 0;
    const lineDiscount = lineTotal * (discountPercent / 100);
    const lineVat = (lineTotal - lineDiscount) * item.kdv;
    const totalPrice = lineTotal - lineDiscount + lineVat;

    newItems[index] = {
      ...newItems[index],
      lineTotal,
      lineDiscount,
      lineVat,
      totalPrice
    };
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    if (isApproved) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
    // Also remove from selected items if it was selected
    const itemToDelete = items[index];
    if (itemToDelete) {
      setSelectedItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToDelete.itemId);
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

  // Derived totals for live summary display (based on selection if any)
  const hasSelection = selectedItemIds.size > 0;
  const itemsForSummary = hasSelection ? items.filter(it => selectedItemIds.has(it.itemId)) : items;
  const liveSubTotal = itemsForSummary.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const liveDiscountTotal = itemsForSummary.reduce((sum, item) => sum + (item.lineDiscount || 0), 0);
  const liveVatTotal = itemsForSummary.reduce((sum, item) => sum + (item.lineVat || 0), 0);
  const liveGrandTotal = itemsForSummary.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">
          {editingOfferId ? 'Teklif Düzenle' : 'Yeni Teklif Ekle'}
        </h3>

        <div className="modal-form">
          {formErrors.length > 0 && (
            <div className="form-errors">
              <ul>
                {formErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <input
            type="text"
            placeholder="Müşteri Adı"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Teklif Adı"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="form-input"
          />
          <input
            type="date"
            value={offerDate}
            onChange={(e) => setOfferDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="form-input"
          />
          <select 
            value={offerStatus} 
            onChange={(e) => setOfferStatus(e.target.value as OfferStatus)} 
            disabled={isApproved}
            className="form-input"
          >
            <option value="Taslak">Taslak</option>
            <option value="Onay Bekliyor">Onay Bekliyor</option>
            <option value="Onaylandı">Onaylandı</option>
          </select>

          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Tür</th>
                  <th>Ad</th>
                  <th>Miktar</th>
                  <th>Tutar</th>
                  <th>İndirim</th>
                  <th>KDV</th>
                  <th>Toplam</th>
                  <th>Seç</th>
                  <th>Sil</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <>
                    <tr key={item.itemId}>
                      <td>
                        <select
                          value={item.itemType}
                          onChange={(e) => handleItemChange(i, 'itemType', e.target.value as ItemType)}
                        >
                          <option value="Malzeme">Malzeme</option>
                          <option value="Hizmet">Hizmet</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.materialServiceName}
                          onChange={(e) => handleItemChange(i, 'materialServiceName', e.target.value)}
                          disabled={isApproved}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={getDisplayValue(i, 'quantity', item.quantity)}
                          onChange={(e) => handleItemChange(i, 'quantity', Number(e.target.value) || 0)}
                          onFocus={() => handleFocus(i, 'quantity')}
                          onBlur={() => handleBlur(i, 'quantity')}
                          disabled={isApproved}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={getDisplayValue(i, 'unitPrice', item.unitPrice)}
                          onChange={(e) => handleItemChange(i, 'unitPrice', Number(e.target.value) || 0)}
                          onFocus={() => handleFocus(i, 'unitPrice')}
                          onBlur={() => handleBlur(i, 'unitPrice')}
                          disabled={isApproved}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          placeholder="%"
                          value={getDisplayValue(i, 'discountAmount', item.discountAmount)}
                          onChange={(e) => handleItemChange(i, 'discountAmount', Number(e.target.value) || 0)}
                          onFocus={() => handleFocus(i, 'discountAmount')}
                          onBlur={() => handleBlur(i, 'discountAmount')}
                          disabled={isApproved}
                        />
                      </td>
                      <td>
                        <select
                          value={item.kdv}
                          onChange={(e) => handleItemChange(i, 'kdv', Number(e.target.value) as 0.08 | 0.18 | 0.20)}
                          disabled={isApproved}
                        >
                          <option value={0.08}>8%</option>
                          <option value={0.18}>18%</option>
                          <option value={0.20}>20%</option>
                        </select>
                      </td>
                      <td>{(item.totalPrice ?? 0).toFixed(2)}</td>
                      <td>
                        <button
                          className={`select-btn${selectedItemIds.has(item.itemId) ? ' selected' : ''}`}
                          onClick={() => {
                            setSelectedItemIds(prev => {
                              const next = new Set(prev);
                              if (next.has(item.itemId)) {
                                next.delete(item.itemId);
                              } else {
                                next.add(item.itemId);
                              }
                              return next;
                            });
                          }}
                          type="button"
                        >
                          {selectedItemIds.has(item.itemId) ? 'Seçildi' : 'Seç'}
                        </button>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteItem(i)}
                          disabled={isApproved}
                          type="button"
                          title="Satırı Sil"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                    <tr key={`${item.itemId}-summary`} className="item-summary-row">
                      <td colSpan={9}>
                        <div className="item-summary">
                          <span>
                            Ara Toplam: <strong>{(item.lineTotal ?? 0).toFixed(2)} ₺</strong>
                          </span>
                          <span>
                            İndirim ({(item.discountAmount ?? 0).toFixed(0)}%): <strong>{(item.lineDiscount ?? 0).toFixed(2)} ₺</strong>
                          </span>
                          <span>
                            KDV: <strong>{(item.lineVat ?? 0).toFixed(2)} ₺</strong>
                          </span>
                          <span>
                            Toplam: <strong>{(item.totalPrice ?? 0).toFixed(2)} ₺</strong>
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>

            <button onClick={handleAddItem} className="add-row-btn">
              + Satır Ekle
            </button>

            <div className="totals-summary">
              <div className="totals-row">
                <span>Ara Toplam:</span>
                <strong>{liveSubTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
              </div>
              <div className="totals-row">
                <span>İndirim Toplamı:</span>
                <strong>{liveDiscountTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
              </div>
              <div className="totals-row">
                <span>KDV Toplamı:</span>
                <strong>{liveVatTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
              </div>
              <div className="totals-row grand">
                <span>Genel Toplam:</span>
                <strong>{liveGrandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={handleSave} className="save-btn">Kaydet</button>
            {editingOfferId && (
              <button
                onClick={() => {
                  if (editingOfferId) {
                    dispatch(deleteOffer(editingOfferId));
                    setModalOpen(false);
                  }
                }}
                className="cancel-btn"
              >
                Sil
              </button>
            )}
            <button onClick={() => setModalOpen(false)} className="cancel-btn">Kapat</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
