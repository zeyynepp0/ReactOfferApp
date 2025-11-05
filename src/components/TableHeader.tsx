import { useState } from 'react';
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import type { ColumnDef } from "../types/tableTypes";
import type { SortConfig } from '../hooks/useSorting'; // useSorting'den SortConfig'i import ediyoruz
import type { FilterCondition, SelectOption } from '../types/filterTypes';
import ColumnMenu from './ColumnMenu';

interface TableHeaderProps<T> {
  columns: ColumnDef<T>[];
  sortConfig: SortConfig<T>;
  handleSort: (col: ColumnDef<T>) => void;
  filters: FilterCondition[];
  handleFilterChange: (columnId: string, filter: FilterCondition | null) => void;
  selectOptionsMap: Map<string, SelectOption[]>;
  toggleColumnVisibility: (header: string) => void;
}


export default function TableHeader<T extends { id: string | number }>(
  { columns, sortConfig, handleSort, filters, handleFilterChange, selectOptionsMap, toggleColumnVisibility, }: TableHeaderProps<T>
) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [startMenuInFilterMode, setStartMenuInFilterMode] = useState(false);
  
  const handleOpenEnu =(header: string, filterMode: boolean)=> {
    if (menuOpenFor === header && filterMode === startMenuInFilterMode) {
      setMenuOpenFor(null);
    } else {
      setMenuOpenFor(header);
      setStartMenuInFilterMode(filterMode);
    }
  };
  
  
  
  
  return (
   <thead>
      <tr>
        {columns.map((col) => {
          const sortKey = col.sortKey ?? (typeof col.fieldKey === 'string' ? col.fieldKey : null);
          const isActive = sortConfig.key === sortKey;
          // Bu sütunun aktif bir filtresi olup olmadığını kontrol et
          const isFiltered = filters.some(f => f.columnId === col.filterKey);

          return (
     <th key={col.header} className="px-4 py-2 text-left relative "> {/* 'relative' ve 'group' eklendi */}
              <div className="flex items-center justify-between">
                
                {/* Başlık ve sıralama ikonları */}
                <div 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort(col)} // Başlığa tıklamak hala sıralama yapıyor
                >
                  <span>{col.header}</span>
                  {/* Filtre ikonu (huni) */}
                  {isFiltered && <FaFilter className="text-blue-500 text-xs" />}
                  
        {/* Sıralama ikonları */}
        {col.hideSort ? null : isActive ? (
            sortConfig.direction === 'asc'
              ? <FiArrowUp className="text-gray-600" />
              : <FiArrowDown className="text-gray-600" />
        ) : null}
                </div>

                {/* "..." Menü Butonu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Sıralamayı tetiklemesin
                    setMenuOpenFor(menuOpenFor === col.header ? null : col.header);
                  }}
                  
                  className="p-1 rounded-md hover:bg-gray-200 "
                >
                  <HiDotsVertical className="text-gray-500" />
                </button>
              </div>

              {/* Eski filtre alanı kaldırıldı. Artık ColumnMenu render edilecek. */}
              {menuOpenFor === col.header && (
                <ColumnMenu
                  column={col}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  handleFilterChange={handleFilterChange}
                  handleHide={() => toggleColumnVisibility(col.header)}
                  onClose={() => setMenuOpenFor(null)}
                  selectOptions={selectOptionsMap.get(col.filterKey as string) || []}
                />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}