import React, { useState } from 'react';
// DÜZELTME: Gereksiz ikon/bileşen import'ları kaldırıldı
import type { ColumnDef } from "../types/tableTypes";
import type { SortConfig } from '../hooks/useSorting'; 
import type { FilterCondition, SelectOption } from '../types/filterTypes';
import {
  SortableContext,
  horizontalListSortingStrategy, 
} from '@dnd-kit/sortable';
import { SortableHeaderCell } from './table/SortableHeaderCell'; 

interface TableHeaderProps<T> {
  columns: ColumnDef<T>[]; 
  sortConfig: SortConfig<T>;
  handleSort: (col: ColumnDef<T>, direction?: 'asc' | 'desc') => void;
  filters: FilterCondition[];
  handleFilterChange: (columnId: string, filter: FilterCondition | null) => void;
  selectOptionsMap: Map<string, SelectOption[]>;
  toggleColumnVisibility: (header: string) => void;
  onColumnOrderChange: (activeId: string, overId: string) => void; // Bu prop Table.tsx'ten gelecek
}

export default function TableHeader<T extends { id: string | number }>(
  { 
    columns, 
    sortConfig, 
    handleSort, 
    filters, 
    handleFilterChange, 
    selectOptionsMap, 
    toggleColumnVisibility,
    onColumnOrderChange, // Prop'u burada al
  }: TableHeaderProps<T>
) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [startMenuInFilterMode, setStartMenuInFilterMode] = useState(false);
  
  // DnDContext Table.tsx içinde. Burada sadece SortableContext kullanıyoruz.

  const columnHeaders = columns.map(c => c.header);
  
  return (
   <thead>
      <SortableContext
        items={columnHeaders}
        strategy={horizontalListSortingStrategy} 
      >
        <tr>
          {columns.map((col) => {
            const isFiltered = filters.some(f => f.columnId === col.filterKey);

            return (
              <SortableHeaderCell
                key={col.header}
                column={col}
                sortConfig={sortConfig}
                isFiltered={isFiltered}
                onSort={() => handleSort(col)} 
                menuOpenFor={menuOpenFor}
                setMenuOpenFor={setMenuOpenFor}
                startMenuInFilterMode={startMenuInFilterMode}
                setStartMenuInFilterMode={setStartMenuInFilterMode}
                handleFilterChange={handleFilterChange}
                handleSort={handleSort} 
                toggleColumnVisibility={toggleColumnVisibility}
                selectOptions={selectOptionsMap.get(col.filterKey as string) || []}
              />
            );
          })}
        </tr>
      </SortableContext>
    </thead>
  );
}