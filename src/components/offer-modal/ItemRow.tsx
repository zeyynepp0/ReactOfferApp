import type { ItemType, OfferLineItem } from '../../redux/offersSlice';

interface ItemRowProps {
  item: OfferLineItem;
  index: number;
  isApproved: boolean;
  selected: boolean;
  onChange: (index: number, field: string, value: any) => void;
  onToggleSelect: (itemId: string) => void;
  onDelete: (index: number) => void;// satır silme işlevi için yeni prop
}
//const [discountUnit , setDiscountUnit] = useState('');
//const [discountPercentage , setDiscountPercentage] = useState('');

export default function ItemRow({ item, index, isApproved, onChange, onDelete }: ItemRowProps) { 
  return (
    <>
      <tr>
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <select
            value={item.itemType}
            onChange={(e) => onChange(index, 'itemType', e.target.value as ItemType)}
            className="w-full"
          >
            <option value="Malzeme">Malzeme</option>
            <option value="Hizmet">Hizmet</option>
          </select>
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <input
            type="text"
            value={item.materialServiceName}
            onChange={(e) => onChange(index, 'materialServiceName', e.target.value)}
            disabled={isApproved}
            className="w-full"
          />
        </td>
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <input
            type="number"
            min={1}
            step={1}
            placeholder="0"
            value={item.quantity === 0 ? '' : item.quantity}
            onChange={(e) => onChange(index, 'quantity', e.target.value === '' ? 0 : Number(e.target.value))}
            disabled={isApproved}
            className="w-full"
          />
        </td>

        
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <input
            type="number"
            min={0}
            step={0.01}
            placeholder="0"
            value={item.unitPrice === 0 ? '' : item.unitPrice}
            onChange={(e) => onChange(index, 'unitPrice', e.target.value === '' ? 0 : Number(e.target.value))}
            disabled={isApproved}
            className="w-full"
          />
        </td>

        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <input
            type="number" 
            value={item.lineTotal === 0 ? '' : item.lineTotal}
            onChange={(e) => onChange(index, 'lineTotal', e.target.value === '' ? 0 : Number(e.target.value))}
            disabled={isApproved}
            className="w-full"
          />
        </td>
       
        
        {/* indirimi yüzde için giren  */}
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            placeholder="0"
            value={item.discountPercentage === 0 ? '' : item.discountPercentage}
            onChange={(e) => onChange(index, 'discountPercentage', e.target.value === '' ? 0 : Number(e.target.value))}
            disabled={isApproved}
            className="w-full"
          />
        </td>

        {/* inidirmi birim olsrsk giren için  */}
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            placeholder="0"
            value={item.discountUnit === 0 ? '' : item.discountUnit}
            onChange={(e) => onChange(index, 'discountUnit', e.target.value === '' ? 0 : Number(e.target.value))}
            disabled={isApproved}
            className="w-full"
          />
        </td>
        
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">{(item.lineDiscount ?? 0).toFixed(2)}</td>

        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <select
            value={item.kdv}
            onChange={(e) => onChange(index, 'kdv', Number(e.target.value) as 0.08 | 0.18 | 0.20)}
            disabled={isApproved}
            className="w-full"
          >
            <option value={0.08}>8%</option>
            <option value={0.18}>18%</option>
            <option value={0.20}>20%</option>
          </select>
        </td>
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">{(item.lineVat ?? 0).toFixed(2)}</td>
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">{(item.totalPrice ?? 0).toFixed(2)}</td>
       
        <td className="border border-slate-200 p-2 text-center align-middle overflow-hidden text-ellipsis">
          <button
            className="bg-red-500 text-white border-0 px-2.5 py-1 rounded-md cursor-pointer text-[16px] font-bold min-w-8 h-8 flex items-center justify-center hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => onDelete(index)}
            disabled={isApproved}
            type="button"
            title="Satırı Sil"
          >
            ×
          </button>
        </td>
      </tr>
      {/* <tr>
        <td colSpan={9} className="bg-[#fcfcfd]">
          <div className="flex gap-4 justify-end">
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
      </tr> */}
    </>
  );
}


