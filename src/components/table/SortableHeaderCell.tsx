// src/components/table/SortableHeaderCell.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import type { ColumnDef } from '../../types/tableTypes';
import type { SortConfig } from '../../hooks/useSorting';
import type { FilterCondition, SelectOption } from '../../types/filterTypes';
import ColumnMenu from '../ColumnMenu'; // ColumnMenu'yü burada render ediyoruz

interface SortableHeaderCellProps<T> {
  column: ColumnDef<T>;
  sortConfig: SortConfig<T>;
  isFiltered: boolean;
  onSort: () => void;
  menuOpenFor: string | null;
  setMenuOpenFor: (header: string | null) => void;
  startMenuInFilterMode: boolean;
  setStartMenuInFilterMode: (mode: boolean) => void;
  // ColumnMenu için props'lar
  handleFilterChange: (columnId: string, filter: FilterCondition | null) => void;
  handleSort: (col: ColumnDef<T>, direction: 'asc' | 'desc') => void;
  toggleColumnVisibility: (header: string) => void;
  selectOptions: SelectOption[];
}

export function SortableHeaderCell<T>({
  column,
  sortConfig,
  isFiltered,
  onSort,
  menuOpenFor,
  setMenuOpenFor,
  startMenuInFilterMode,
  setStartMenuInFilterMode,
  handleFilterChange,
  handleSort,
  toggleColumnVisibility,
  selectOptions,
}: SortableHeaderCellProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.header });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 1, // Sürüklerken üstte kalması için
  };

  const sortKey = column.sortKey ?? (typeof column.fieldKey === 'string' ? column.fieldKey : null);
  const isActive = sortConfig.key === sortKey;

  const handleMenuToggle = (filterMode: boolean) => {
    if (menuOpenFor === column.header && filterMode === startMenuInFilterMode) {
      setMenuOpenFor(null);
    } else {
      setMenuOpenFor(column.header);
      setStartMenuInFilterMode(filterMode);
    }
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-4 py-2 text-left relative bg-white" // 'relative' pozisyonu ColumnMenu için kritik
    >
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-1 cursor-pointer"
          onClick={onSort}
          {...attributes} // Sürükleme özelliklerini başlığa ata
          {...listeners} // Sürükleme dinleyicilerini başlığa ata
        >
          <span>{column.header}</span>
          
          {isFiltered && <FaFilter className="text-blue-500 text-xs ml-1" />}
          
          {column.hideSort ? null : isActive ? (
              sortConfig.direction === 'asc'
                ? <FiArrowUp className="text-gray-600" />
                : <FiArrowDown className="text-gray-600" />
          ) : null}
        </div>

        {/* Sütun bazlı "..." menü butonu */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Sürüklemeyi/Sıralamayı tetiklemesin
            handleMenuToggle(false);
          }}
          className="p-1 rounded-md hover:bg-gray-200"
        >
          <HiDotsVertical className="text-gray-500" />
        </button>
      </div>

      {/* Sütun Menüsü (açıksa) */}
      {menuOpenFor === column.header && (
        <ColumnMenu
          column={column}
          sortConfig={sortConfig}
          handleSort={(col, dir) => {
            handleSort(col, dir); 
            setMenuOpenFor(null); // İşlem sonrası menüyü kapat
          }}
          handleFilterChange={handleFilterChange}
          handleHide={() => {
            toggleColumnVisibility(column.header);
            setMenuOpenFor(null); // İşlem sonrası menüyü kapat
          }}
          onClose={() => setMenuOpenFor(null)}
          selectOptions={selectOptions}
          startInFilterView={startMenuInFilterMode}
        />
      )}
    </th>
  );
}