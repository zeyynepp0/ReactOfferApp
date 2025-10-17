import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { OfferLineItem, OfferStatus } from '../redux/offersSlice';
import { computeLineDerived, computeLiveTotals, normalizeItems } from '../utils/offerCalculations';


export const useOfferForm = (editingOfferId: string | null, offers: any[]) => {
  const [customerName, setCustomerName] = useState('');
  const [offerName, setOfferName] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerStatus, setOfferStatus] = useState<OfferStatus>('Taslak');
  const [items, setItems] = useState<OfferLineItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const isApproved = offerStatus === 'Onaylandı';

  
  useEffect(() => {
    if (editingOfferId) {
      const offer = offers.find(o => o.id === editingOfferId);
      if (offer) {
        setCustomerName(offer.customerName);
        setOfferName(offer.offerName);
        setOfferDate(offer.offerDate);
        setOfferStatus(offer.offerStatus as OfferStatus);
        setItems(normalizeItems(offer.items).filter(item => item.isActiveLine).map(it => ({ 
          ...it, 
          itemId: it.itemId || uuidv4() 
        })));
      }
      console.log("Editing Offer ID:", editingOfferId);

    } else {
      
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setOfferDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [editingOfferId, offers]);

  
  useEffect(() => {
    if (items.length === 0 && offerStatus !== 'Taslak') {
      setOfferStatus('Taslak');
    }
    if (items.length > 0 && offerStatus === 'Taslak') {
      setOfferStatus('Onay Bekliyor');
    }
  }, [items, offerStatus]);

  const addItem = useCallback(() => {
    if (isApproved) return;
    const newItem: OfferLineItem = {
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
    setItems(prev => [...prev, newItem]);
  }, [isApproved]);

  const updateItem = useCallback((index: number, field: string, value: any) => {
    if (isApproved) return;
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      
      const computed = computeLineDerived(newItems[index]);
      newItems[index] = { ...newItems[index], ...computed };
      
      return newItems;
    });
  }, [isApproved]);

  const deleteItem = useCallback((index: number) => {
    if (isApproved) return;
    const itemToDelete = items[index];
    if (itemToDelete) {
      setSelectedItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToDelete.itemId);
        return newSet;
      });
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  }, [isApproved, items]);

  const toggleItemSelection = useCallback((itemId: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId); 
      else next.add(itemId);
      return next;
    });
  }, []);

  const calculateTotals = useCallback(() => {
    const subTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const discountTotal = items.reduce((sum, item) => sum + item.lineDiscount, 0);
    const vatTotal = items.reduce((sum, item) => sum + item.lineVat, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return { subTotal, discountTotal, vatTotal, grandTotal };
  }, [items]);

  const { subTotal: liveSubTotal, discountTotal: liveDiscountTotal, vatTotal: liveVatTotal, grandTotal: liveGrandTotal } = computeLiveTotals(items, selectedItemIds);

  return {
    // Form fields
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
    
    // Computed values
    isApproved,
    liveSubTotal,
    liveDiscountTotal,
    liveVatTotal,
    liveGrandTotal,
    
    // Actions
    addItem,
    updateItem,
    deleteItem,
    toggleItemSelection,
    calculateTotals,
  };
};
