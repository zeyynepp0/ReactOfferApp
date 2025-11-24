import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Menu from "../menu/Menu";
import { SortableColumnItem } from "./SortableColumnItem";
import type { ColumnDef } from "../../types/tableTypes";

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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const orderedColumns = React.useMemo(
    () =>
      columnOrder
        .map((header) => allColumns.find((col) => col.header === header))
        .filter(Boolean) as ColumnDef<T>[],
    [columnOrder, allColumns]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourceIndex = columnOrder.indexOf(active.id as string);
    const targetIndex = columnOrder.indexOf(over.id as string);
    setColumnOrder(arrayMove(columnOrder, sourceIndex, targetIndex));
  };

  const trigger = (
    <button className="p-2 rounded-full hover:bg-gray-200" aria-label="Tablo ayarları">
      <HiDotsVertical className="text-gray-700 h-5 w-5" />
    </button>
  );

  return (
    <div className="absolute top-2 right-2 z-30">
      <Menu
        trigger={trigger}
        side="left"
        content={(closeMenu) => (
          <div className="w-72">
            <button
              onClick={() => {
                clearAllFilters();
                closeMenu();
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Tüm Filtreleri Temizle
            </button>
            <div className="border-t border-gray-100 px-3 py-2 text-sm font-semibold text-gray-800">
              Sütunları Yönet
            </div>
            <div className="max-h-64 overflow-y-auto">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                  {orderedColumns.map((col) => (
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
      />
    </div>
  );
}