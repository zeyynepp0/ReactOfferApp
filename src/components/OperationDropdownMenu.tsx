// src/components/OperationDropdownMenu.tsx
import React from 'react';
import type { FilterOperations } from '../types/filterTypes';
import type { OperationOption } from '../types/filterTypes'; // Tipi ana dosyadan alacağız
import OperationDropdownItem from './OperationDropdownItem';

interface OperationDropdownMenuProps {
  isOpen: boolean;
  options: OperationOption[];
  onSelect: (value: FilterOperations) => void;
}

const OperationDropdownMenu: React.FC<OperationDropdownMenuProps> = ({ isOpen, options, onSelect }) => {
  if (!isOpen) return null;

  return (
    // Boyutlandırma mantığı burada:
    // w-full: Butonun genişliğine uymaya çalışır.
    // min-w-48: Genişlik en az 192px (Tailwind'in 48 birimi) olur.
    // Sonuç: Genişlik = max(buton_genişliği, 192px)
    <div className="absolute mt-1 w-full min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
      {options.map((option) => (
        <OperationDropdownItem
          key={option.value}
          option={option}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default OperationDropdownMenu;