import React, { useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableColumnItem } from './SortableColumnItem';
import type { ColumnDef } from '../../types/tableTypes';

interface TableSettingsMenuProps<T> {
  allColumns: ColumnDef<T>[];
  visibleColumns: Set<string>;
  toggleColumnVisibility: (header: string) => void;
  clearAllFilters: () => void;
  columnOrder: string[]; // Array of header strings
  setColumnOrder: (order: string[]) => void;
}

export function TableSettingsMenu<T>({
  allColumns,
  visibleColumns,
  toggleColumnVisibility,
  clearAllFilters,
  columnOrder,
  setColumnOrder,
}: TableSettingsMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Dışarıya tıklamayı algıla ve menüyü kapat
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
    }
  }

  // Sütun sırasını (string dizisi) render edilecek ColumnDef objelerine dönüştür
  const orderedColumns = React.useMemo(() => {
    return columnOrder
      .map(header => allColumns.find(col => col.header === header))
      .filter(Boolean) as ColumnDef<T>[];
  }, [columnOrder, allColumns]);

  return (
    <div className="absolute top-2 right-2 z-30" ref={menuRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2 rounded-full hover:bg-gray-200"
        aria-label="Tablo ayarları"
      >
        <HiDotsVertical className="text-gray-700 h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b">
            <button
              onClick={() => {
                clearAllFilters();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Tüm Filtreleri Temizle
            </button>
          </div>
          <div className="p-2 font-semibold text-sm text-gray-800 border-b">
            Sütunları Yönet
          </div>
          <div className="max-h-60 overflow-y-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columnOrder}
                strategy={verticalListSortingStrategy}
              >
                {orderedColumns.map(col => (
                  <SortableColumnItem
                    key={col.header}
                    id={col.header}
                    column={col}
                    isVisible={visibleColumns.has(col.header)}
                    onToggleVisibility={() => toggleColumnVisibility(col.header)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
}