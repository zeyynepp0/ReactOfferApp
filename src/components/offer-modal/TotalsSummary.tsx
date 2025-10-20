// src/components/offer-modal/TotalsSummary.tsx

interface TotalsSummaryProps {
  subTotal?: number; // Propları optional (?) yaptık
  discountTotal?: number;
  vatTotal?: number;
  grandTotal?: number;
}

export default function TotalsSummary({ subTotal, discountTotal, vatTotal, grandTotal }: TotalsSummaryProps) {
  // ?? 0 ekleyerek undefined/null durumunda 0 kullanılmasını sağladık
  const sub = subTotal ?? 0;
  const discount = discountTotal ?? 0;
  const vat = vatTotal ?? 0;
  const grand = grandTotal ?? 0;

  return (
    <div className="mt-3 border-t border-slate-200 pt-3">
      <div className="flex justify-end gap-2 mt-1">
        <span>Ara Toplam:</span>
        {/* Değişkenleri kullanıyoruz */}
        <strong>{sub.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <span>İndirim Toplamı:</span>
        <strong>{discount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <span>KDV Toplamı:</span>
        <strong>{vat.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
      </div>
      <div className="flex justify-end gap-2 mt-1 font-bold text-lg"> {/* Biraz daha belirgin hale getirelim */}
        <span>Genel Toplam:</span>
        <strong>{grand.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
      </div>
    </div>
  );
}