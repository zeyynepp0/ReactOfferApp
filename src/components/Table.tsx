import React, { useMemo, useState } from 'react';
import type { ColumnDef, TableProps } from '../types/tableTypes';
import type { SelectOption } from '../types/filterTypes';
import useSorting from '../hooks/useSorting';
import { useFiltering } from '../hooks/useFiltering';
import { useFilteredData } from '../hooks/useFilteredData';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { TableSettingsMenu } from './table/TableSettingsMenu';
import { useColumnVisibility } from '../hooks/useColumnVisibility';
import { useColumnOrder } from '../hooks/useColumnOrder';
import { useSelectOptionsMap } from '../hooks/useSelectOptionsMap';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

export default function Table<T extends { id: string | number }>({
  columns,
  data = [],
  emptyDataText = 'Veri bulunamadı',
  onRowClick,
}: TableProps<T>) {
  // Sütun görünürlüğü ve sırası
  const { visibleColumns, toggleColumnVisibility, visibleOrdered } = useColumnVisibility(columns);
  const { columnOrder, setColumnOrder, orderedAllColumns, reorder } = useColumnOrder(columns);
  const visibleOrderedColumns = useMemo(
    () => visibleOrdered(orderedAllColumns),
    [orderedAllColumns, visibleOrdered]
  );

  // Filtreleme
  const { filters, handleFilterChange, clearAllFilters } = useFiltering();

  // Select filtreleri için opsiyon haritası (veriden türet)
  const selectOptionsMap = useSelectOptionsMap(columns, data);

  // Arama (genel)
  const [searchTerm, setSearchTerm] = useState('');

  // Sıralama
  const { sortConfig, handleSort, sortedData } = useSorting<T>(data);

  // Filtre uygula + arama uygula
  const { filteredData } = useFilteredData<T>(sortedData, visibleOrderedColumns, filters, searchTerm);

  // Header sürükle-bırak sırası güncellemesi
  const handleHeaderOrderChange = (activeId: string, overId: string) => {
    reorder(activeId, overId);
  };

  // DnD sensors and handlers
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      handleHeaderOrderChange(active.id as string, over.id as string);
    }
  }

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-2">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Ara"
          className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
        />
      </div>

      <div className="border-slate-200 rounded-md overflow-y-auto min-h-[400px] bg-white">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className=" min-w-full border-collapse ">
            <TableHeader<T>
              columns={visibleOrderedColumns}
              sortConfig={sortConfig}
              handleSort={handleSort}
              filters={filters}
              handleFilterChange={handleFilterChange}
              selectOptionsMap={selectOptionsMap}
              toggleColumnVisibility={toggleColumnVisibility}
              onColumnOrderChange={handleHeaderOrderChange}
            />
            <TableBody<T>
              columns={visibleOrderedColumns}
              sortedData={filteredData}
              emptyDataText={emptyDataText}
              searchTerm={searchTerm}
              onRowClick={onRowClick}
            />
          </table>
        </DndContext>
      </div>

      <TableSettingsMenu<T>
        allColumns={columns}
        visibleColumns={visibleColumns}
        toggleColumnVisibility={toggleColumnVisibility}
        clearAllFilters={clearAllFilters}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
      />
    </div>
  );
}