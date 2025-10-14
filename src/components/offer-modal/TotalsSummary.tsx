
interface TotalsSummaryProps {
  subTotal: number;
  discountTotal: number;
  vatTotal: number;
  grandTotal: number;
}

export default function TotalsSummary({ subTotal, discountTotal, vatTotal, grandTotal }: TotalsSummaryProps) {
  return (
    <div className="mt-3 border-t border-slate-200 pt-3">
      <div className="flex justify-end gap-2 mt-1">
        <span>Ara Toplam:</span>
        <strong>{subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ₺</strong>
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <span>İndirim Toplamı:</span>
        <strong>{discountTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ₺</strong>
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <span>KDV Toplamı:</span>
        <strong>{vatTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ₺</strong>
      </div>
      <div className="flex justify-end gap-2 mt-1 ">
        <span>Genel Toplam:</span>
        <strong>{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ₺</strong>
      </div>
    </div>
  );
}


