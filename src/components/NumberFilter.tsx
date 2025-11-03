import React, { useState, useEffect } from 'react';
import type { FilterCondition, NumberOperation } from '../types/filterTypes';
import OperationButton from './OperationButton';
import useDebounce from '../hooks/useDebounce';

interface NumberFilterProps {
  columnId: string;
  onFilterChange: (filter: FilterCondition | null) => void;
}

const NumberFilter: React.FC<NumberFilterProps> = ({ columnId, onFilterChange }) => {
const [operation, setOperation] = useState<NumberOperation>('equals');
//const [value, setValue] = useState<string | { from: string, to: string }>('');
const[immediateValue, setImmediateValue] = useState<string |{from: string, to:string}> ('')
 const debouncedValue = useDebounce(immediateValue, 300);

// Operasyon veya değer değiştikçe ana filtre durumunu güncelle
  useEffect(() => {
    let filterValue: FilterCondition['value'] = null;
    let isValid = false;

    if (operation === 'between') {
      const { from, to } = debouncedValue as { from: string, to: string };
      if (from !== '' && to !== '') {
        filterValue = { from: Number(from), to: Number(to) };
        isValid = true;
      }
    } else {
      if (debouncedValue !== '') {
        filterValue = Number(debouncedValue as string);
        isValid = true;
      }
    }

    if (isValid) {
      onFilterChange({
        columnId,
        filterType: 'number',
        operation,
        value: filterValue,
      });
    } else {
      onFilterChange(null); // Koşul geçersizse filtreyi kaldır
    }
  }, [debouncedValue, operation, columnId]);

  // Operasyon değiştiğinde, 'between' için obje, diğerleri için string state ayarla
  const handleOperationChange = (op: NumberOperation) => {
    setOperation(op);
    if (op === 'between') {
      setImmediateValue({ from: '', to: '' });
    } else {
      setImmediateValue('');
    }
  };

  return (
    <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
      <OperationButton
        filterType="number"
        value={operation}
        onChange={(op) => handleOperationChange(op as NumberOperation)}
      />
      {operation === 'between' ? (
        <div className="flex gap-2">
          <input
            type="number"
            className="border border-gray-300 rounded-md p-2 w-1/2 text-sm"
            placeholder="Min"
            value={(immediateValue as { from: string }).from}
            onChange={(e) => setImmediateValue({ ...(immediateValue as { from: string, to: string }), from: e.target.value })}
          />
          <input
            type="number"
            className="border border-gray-300 rounded-md p-2 w-1/2 text-sm"
            placeholder="Max"
            value={(immediateValue as { to: string }).to}
            onChange={(e) => setImmediateValue({ ...(immediateValue as { from: string, to: string }), to: e.target.value })}
          />
        </div>
      ) : (
        <input
          type="number"
          className="border border-gray-300 rounded-md p-2 w-full text-sm"
          placeholder="Değer girin..."
          value={immediateValue as string}
          onChange={(e) => setImmediateValue(e.target.value)}
        />
      )}
    </div>
  );
};

export default NumberFilter;