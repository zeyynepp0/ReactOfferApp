// src/components/OperationDropdownItem.tsx
import React from 'react';
import type { OperationOption } from '../../types/filterTypes'; // Tipi ana dosyadan alacağız

interface OperationDropdownItemProps {
  option: OperationOption;
  onSelect: (value: OperationOption['value']) => void;
}

const OperationDropdownItem: React.FC<OperationDropdownItemProps> = ({ option, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition flex justify-between items-center"
    >
      <span>{option.label}</span>
      <span className="text-xs text-gray-500 ml-2">({option.description})</span>
    </button>
  );
};

export default OperationDropdownItem;