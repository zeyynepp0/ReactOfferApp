import type { OfferLineItem } from '../redux/offersSlice';

export type ComputedLine = Pick<OfferLineItem, 'lineTotal' | 'lineDiscount' | 'lineVat' | 'totalPrice'>;

export function computeLineDerived(item: OfferLineItem): ComputedLine {// item objesinin tüm özelliklerini ComputedLine objesine kopyalar
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const discountPercent = Number(item.discountAmount) || 0;
  const kdv = typeof item.kdv === 'number' ? item.kdv : 0.18;

  const lineTotal = quantity * unitPrice;
  const lineDiscount = lineTotal * (discountPercent / 100);
  const lineVat = (lineTotal - lineDiscount) * kdv;
  const totalPrice = lineTotal - lineDiscount + lineVat;

  return { lineTotal, lineDiscount, lineVat, totalPrice };
}

export function normalizeLineItem(raw: OfferLineItem): OfferLineItem {
  const normalized: OfferLineItem = {
    ...raw,// raw objesinin tüm özelliklerini normalized objesine kopyalar
    quantity: Number(raw.quantity) || 0,
    unitPrice: Number(raw.unitPrice) || 0,
    discountAmount: Number(raw.discountAmount) || 0,
    kdv: typeof raw.kdv === 'number' ? raw.kdv : 0.18,
  };
  const computed = computeLineDerived(normalized);
  return { ...normalized, ...computed };
}

export function normalizeItems(items: OfferLineItem[]): OfferLineItem[] {
  return items.map(normalizeLineItem);
}

export function computeTotals(items: OfferLineItem[]) {
  const subTotal = items.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
  const discountTotal = items.reduce((sum, it) => sum + (it.lineDiscount || 0), 0);
  const vatTotal = items.reduce((sum, it) => sum + (it.lineVat || 0), 0);
  const grandTotal = items.reduce((sum, it) => sum + (it.totalPrice || 0), 0);
  return { subTotal, discountTotal, vatTotal, grandTotal };
}

export function computeLiveTotals(items: OfferLineItem[], selectedIds: Set<string>) {
  const hasSelection = selectedIds.size > 0;
  const source = hasSelection ? items.filter(i => selectedIds.has(i.itemId)) : items;
  return computeTotals(source);
}


