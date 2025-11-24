// Simplified ColumnMenu: small API, optional anchor (viewport coords), filter opens as right-side submenu
import { useState, useRef, useEffect } from 'react';
import type { ColumnDef } from '../../types/tableTypes';
import type { FilterCondition, SelectOption } from '../../types/filterTypes';
import type { SortConfig } from '../../hooks/useSorting';
import { FaSortUp, FaSortDown, FaFilter, FaEyeSlash } from 'react-icons/fa';

import TextFilter from '../filters/TextFilter';
import NumberFilter from '../filters/NumberFilter';
import DateFilter from '../filters/DateFilter';
import SelectFilter from '../filters/SelectFilter';

type Anchor = { top: number; left: number; width?: number } | null;

type Props<T> = {
  column: ColumnDef<T>;
  sortConfig: SortConfig<T>;
  handleSort: (col: ColumnDef<T>, dir: 'asc' | 'desc') => void;
  handleFilterChange: (columnId: string, filter: FilterCondition | null) => void;
  handleHide: () => void;
  onClose: () => void;
  selectOptions: SelectOption[];
  startInFilterView?: boolean;
  anchor?: Anchor; // optional viewport anchor
};

export default function ColumnMenu<T>({
  column,
  handleSort,
  handleFilterChange,
  handleHide,
  onClose,
  selectOptions,
  startInFilterView = false,
  anchor = null,
}: Props<T>) {
  const [showFilter, setShowFilter] = useState(startInFilterView);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => setShowFilter(startInFilterView), [startInFilterView]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  const renderFilter = () => {
    if (!column.filterKey || !column.filterType) return <div className="p-2 text-sm text-gray-500">No filter</div>;
    const id = String(column.filterKey);
    return (
      <div className="p-2">
        {column.filterType === 'text' && <TextFilter columnId={id} onFilterChange={(f) => handleFilterChange(id, f)} />}
        {column.filterType === 'number' && <NumberFilter columnId={id} onFilterChange={(f) => handleFilterChange(id, f)} />}
        {column.filterType === 'date' && <DateFilter columnId={id} onFilterChange={(f) => handleFilterChange(id, f)} />}
        {column.filterType === 'select' && <SelectFilter columnId={id} options={selectOptions || []} isMulti={!!column.filterSelectIsMulti} onFilterChange={(f) => handleFilterChange(id, f)} />}
        <button onClick={() => { handleFilterChange(id, null); onClose(); }} className="w-full mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm">Temizle</button>
      </div>
    );
  };

  const anchored = Boolean(anchor);
  const style: React.CSSProperties | undefined = anchor ? { position: 'fixed', top: anchor.top, left: anchor.left, minWidth: anchor.width ?? 200, zIndex: 1000 } : undefined;

  return (
    <div ref={ref} className={anchored ? 'relative' : 'absolute top-full right-0 mt-1 z-10'} style={style} onClick={(e) => e.stopPropagation()}>
      <div className="w-64 bg-white border border-gray-200 rounded-md shadow-lg">
        {!column.hideSort && (
          <>
            <button onClick={() => { handleSort(column, 'asc'); onClose(); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"><FaSortUp /> Sırala A-Z</button>
            <button onClick={() => { handleSort(column, 'desc'); onClose(); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"><FaSortDown /> Sırala Z-A</button>
          </>
        )}
        {column.filterKey && <button onClick={() => setShowFilter(true)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-t"><FaFilter /> Filtrele</button>}
        <button onClick={() => { handleHide(); onClose(); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-t"><FaEyeSlash /> Gizle</button>
      </div>

      {showFilter && (
        <div className="absolute top-0 left-full ml-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
          <div className="p-2">
            <button onClick={() => setShowFilter(false)} className="px-2 py-1 text-sm text-blue-600 hover:underline">← Geri</button>
            {renderFilter()}
          </div>
        </div>
      )}
    </div>
  );
}