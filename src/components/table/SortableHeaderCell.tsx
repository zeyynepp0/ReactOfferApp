// src/components/table/SortableHeaderCell.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { HiDotsVertical, HiMenu } from "react-icons/hi";
import type { ColumnDef } from '../../types/tableTypes';
import type { SortConfig } from '../../hooks/useSorting';
import type { FilterCondition, SelectOption } from '../../types/filterTypes';
import ColumnMenu from './ColumnMenu'; // ColumnMenu'yü burada render ediyoruz

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
  const headerRef = React.useRef<HTMLElement | null>(null);
  const [anchor, setAnchor] = React.useState<{ top: number; left: number; width?: number } | null>(null);
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
      setAnchor(null);
      return;
    }
    const el = headerRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setAnchor({ top: r.bottom + window.scrollY, left: r.left + window.scrollX, width: r.width });
    } else {
      setAnchor(null);
    }
    setMenuOpenFor(column.header);
    setStartMenuInFilterMode(filterMode);
  };

  return (
    <>
    <th
      ref={(el) => { setNodeRef(el); headerRef.current = el; }}
      style={style}
      className="px-4 py-2 text-left bg-white"
    >
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-2"
        >
          {/* Drag handle: sadece bu butona sürükleme listener'ları uygulanır. */}
          <button
            {...attributes}
            {...listeners}
            aria-label="Sütunu taşı"
            className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            onClick={(e) => e.stopPropagation()} // handle click won't toggle sort
          >
            <HiMenu />
          </button>

          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={onSort}
          >
            <span>{column.header}</span>
            {isFiltered && <FaFilter className="text-blue-500 text-xs ml-1" />}

            {column.hideSort ? null : isActive ? (
                sortConfig.direction === 'asc'
                  ? <FiArrowUp className="text-gray-600" />
                  : <FiArrowDown className="text-gray-600" />
            ) : null}
          </div>
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
          handleSort={(col, dir) => { handleSort(col, dir); setMenuOpenFor(null); setAnchor(null); }}
          handleFilterChange={handleFilterChange}
          handleHide={() => { toggleColumnVisibility(column.header); setMenuOpenFor(null); setAnchor(null); }}
          onClose={() => { setMenuOpenFor(null); setAnchor(null); }}
          selectOptions={selectOptions}
          startInFilterView={startMenuInFilterMode}
          anchor={anchor}
        />
      )}
    </th>
    </>

  );
}