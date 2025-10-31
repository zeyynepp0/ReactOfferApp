// src/components/filters/TextFilter.tsx
import React, { useState, useEffect } from 'react';
import type { FilterCondition, TextOperation } from '../types/filterTypes';
import OperationSelect from './OperationSelection';
import useDebounce from '../hooks/useDebounce';

interface TextFilterProps {
  columnId: string;
  onFilterChange: (filter: FilterCondition | null) => void;
}

const TextFilter: React.FC<TextFilterProps> = ({ columnId, onFilterChange }) => {
const [operation, setOperation] = useState<TextOperation>('contains');

const[immediateValue, setImmediateValue] = useState('');
const debonceValue = useDebounce(immediateValue,300);

  // Operasyon veya değer değiştikçe ana filtre durumunu güncelle
  useEffect(() => {
    if (debonceValue === '') {
      onFilterChange(null); // Değer boşsa filtreyi kaldır
    } else {
      onFilterChange({
        columnId,
        filterType: 'text',
        operation,
        value:debonceValue,
      });
    }
  }, [debonceValue, operation, columnId]);

  return (
    <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
      <OperationSelect
        filterType="text"
        value={operation}
        onChange={(op) => setOperation(op as TextOperation)}
      />
      <input
        type="text"
        className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-blue-500 focus:ring-blue-500"
        placeholder="Metin giriniz..."
        value={immediateValue}
        onChange={(e) => setImmediateValue(e.target.value)}
      />
    </div>
  );
};

export default TextFilter;