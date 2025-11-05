// src/components/ColumnMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { ColumnDef } from '../types/tableTypes';
import type { FilterCondition, SelectOption } from '../types/filterTypes';
import type { SortConfig } from '../hooks/useSorting';
import { FaSortUp, FaSortDown, FaFilter, FaEyeSlash } from 'react-icons/fa';

// Filter bileşenlerini import et
import TextFilter from './TextFilter';
import NumberFilter from './NumberFilter';
import DateFilter from './DateFilter';
import SelectFilter from './SelectFilter';

interface ColumnMenuProps<T> {
  column: ColumnDef<T>;
  sortConfig: SortConfig<T>;
  handleSort: (col: ColumnDef<T>, direction: 'asc' | 'desc') => void;
  handleFilterChange: (columnId: string, filter: FilterCondition | null) => void;
  handleHide: () => void;
  onClose: () => void;
  selectOptions: SelectOption[];
  startInFilterView?: boolean;
}

export default function ColumnMenu<T>({
  column,
  sortConfig,
  handleSort,
  handleFilterChange,
  handleHide,
  onClose,
  selectOptions,
  startInFilterView = false,
}: ColumnMenuProps<T>) {
  const [showFilter, setShowFilter] = useState(startInFilterView);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowFilter(startInFilterView);
  }, [startInFilterView]);
  
  // Dışarıya tıklamayı algıla ve menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const renderFilter = () => {
    if (!column.filterKey || !column.filterType) {
      return <div className="p-2 text-sm text-gray-500">Bu sütun için filtreleme mevcut değil.</div>;
    }

    const columnId = column.filterKey as string;

    return (
      <div className="p-2">
        {/* Sütun tipine göre doğru filtre bileşenini render et */}
        {column.filterType === 'text' && (
          <TextFilter
            columnId={columnId}
            onFilterChange={(filter) => handleFilterChange(columnId, filter)}
          />
        )}
        {column.filterType === 'number' && (
          <NumberFilter
            columnId={columnId}
            onFilterChange={(filter) => handleFilterChange(columnId, filter)}
          />
        )}
        {column.filterType === 'date' && (
          <DateFilter
            columnId={columnId}
            onFilterChange={(filter) => handleFilterChange(columnId, filter)}
          />
        )}
        {column.filterType === 'select' && (
          <SelectFilter
            columnId={columnId}
            onFilterChange={(filter) => handleFilterChange(columnId, filter)}
            options={selectOptions || []}
            isMulti={column.filterSelectIsMulti || false}
          />
        )}
        {/* "X" butonu yerine "Filtreyi Temizle" butonu */}
        <button
          onClick={() => {
            handleFilterChange(columnId, null);
            onClose();
          }}
          className="w-full mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Filtreyi Temizle
        </button>
      </div>
    );
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-20"
      onClick={(e) => e.stopPropagation()} // Arka plana tıklamayı engelle
    >
      {!showFilter ? (
        // Ana Menü (Sırala, Filtrele, Gizle)
        <div className="py-1">
          {!column.hideSort && (
            <>
              <button
                onClick={() => { handleSort(column, 'asc'); onClose(); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaSortUp /> Sort by ASC
              </button>
              <button
                onClick={() => { handleSort(column, 'desc'); onClose(); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaSortDown /> Sort by DESC
              </button>
            </>
          )}
          {column.filterKey && (
            <button
              onClick={() => setShowFilter(true)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
            >
              <FaFilter /> Filter
            </button>
          )}
          <button
            onClick={() => { handleHide(); onClose(); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
          >
            <FaEyeSlash /> Hide column
          </button>
        </div>
      ) : (
        // Filtreleme Arayüzü
        <div>
          <button 
            onClick={() => setShowFilter(false)}
            className="px-2 py-1 text-sm text-blue-600 hover:underline"
          >
            &larr; Geri
          </button>
          {renderFilter()}
        </div>
      )}
    </div>
  );
}