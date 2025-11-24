import React from 'react';
import type { FilterOperations } from '../../types/filterTypes';
import type { OperationOption } from '../../types/filterTypes'; // Tipi ana dosyadan alacağız
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