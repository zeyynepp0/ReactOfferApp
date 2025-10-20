// src/utils/offerCalculations.ts
import type { OfferLineItem } from '../redux/offersSlice';

export type ComputedLine = Pick<OfferLineItem, 'lineTotal' | 'lineDiscount' | 'lineVat' | 'totalPrice'>;

// Bu fonksiyon, birim fiyat, miktar ve indirimlere göre satırın hesaplanmış değerlerini döndürür
export function computeLineDerived(item: OfferLineItem): ComputedLine {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const kdv = typeof item.kdv === 'number' ? item.kdv : 0.18;
  const discountPercent = Number(item.discountPercentage) || 0;
  const discountUnit = Number(item.discountUnit) || 0;
  
  const lineTotal = quantity * unitPrice;
  // Hem yüzde hem de birim indirimi uygula
  const lineDiscount = lineTotal * (discountPercent / 100) + discountUnit ;
  // KDV matrahı negatif olamaz
  const vatBase = Math.max(0, lineTotal - lineDiscount);
  const lineVat = vatBase * kdv;
  const totalPrice = vatBase + lineVat;

  return { lineTotal, lineDiscount, lineVat, totalPrice };
}

// Bu fonksiyon, bir teklifteki tüm satırların toplamlarını hesaplar
export function computeTotals(items: OfferLineItem[]) {
  const subTotal = items.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
  const discountTotal = items.reduce((sum, it) => sum + (it.lineDiscount || 0), 0);
  const vatTotal = items.reduce((sum, it) => sum + (it.lineVat || 0), 0);
  const grandTotal = items.reduce((sum, it) => sum + (it.totalPrice || 0), 0);
  
  return { subTotal, discountTotal, vatTotal, grandTotal };
}

// Bu fonksiyon, seçili satırların veya tüm satırların toplamını hesaplar (Bu projede şu an kullanılmıyor ama faydalı olabilir)
export function computeLiveTotals(items: OfferLineItem[], selectedIds: Set<string>) {
  const hasSelection = selectedIds.size > 0;
  const source = hasSelection ? items.filter(i => selectedIds.has(i.itemId)) : items;
  return computeTotals(source);
}