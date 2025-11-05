// src/components/table/SortableColumnItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HiMenu } from 'react-icons/hi';
import type { ColumnDef } from '../../types/tableTypes';

interface SortableColumnItemProps<T> {
  id: string;
  column: ColumnDef<T>;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function SortableColumnItem<T>({ id, column, isVisible, onToggleVisibility }: SortableColumnItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-2 bg-white hover:bg-gray-50"
    >
      <div className="flex items-center">
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing"
          aria-label="Sıralamak için sürükle"
        >
          <HiMenu className="text-gray-500" />
        </button>
        <label className="ml-2 flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={onToggleVisibility}
            className="mr-2"
          />
          {column.header}
        </label>
      </div>
    </div>
  );
}