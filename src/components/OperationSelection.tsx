import React from 'react';
import type { FilterOperations, TextOperation, NumberOperation, DateOperation, SelectOperation } from '../types/filterTypes';
import type { FilterType } from '../types/tableTypes';


const FILTER_OPERATIONS_MAP: Record<FilterType, { value: FilterOperations, label: string }[]> = {
  text: [
    { value: 'contains' as TextOperation, label: 'İçerir' },
    { value: 'notContains' as TextOperation, label: 'İçermez' },
    { value: 'equals' as TextOperation, label: 'Eşittir' },
    { value: 'notEquals' as TextOperation, label: 'Eşit değildir' },
    { value: 'startsWith' as TextOperation, label: 'İle başlar' },
    { value: 'endsWith' as TextOperation, label: 'İle biter' },
  ],
  number: [
    { value: 'equals' as NumberOperation, label: 'Eşittir' },
    { value: 'notEquals' as NumberOperation, label: 'Eşit değildir' },
    { value: 'gt' as NumberOperation, label: '>' },
    { value: 'gte' as NumberOperation, label: '>=' },
    { value: 'lt' as NumberOperation, label: '<' },
    { value: 'lte' as NumberOperation, label: '<=' },
    { value: 'between' as NumberOperation, label: 'Arasında' },
  ],
  date: [
    { value: 'is' as DateOperation, label: 'Tarih' },
    { value: 'notEquals' as DateOperation, label: 'Eşit değildir' },
    { value: 'gt' as DateOperation, label: 'Sonra' },
    { value: 'lt' as DateOperation, label: 'Önce' },
    { value: 'between' as DateOperation, label: 'Arasında' },
  ],
  select: [
    { value: 'is' as SelectOperation, label: 'Seçili' },
    { value: 'isNot' as SelectOperation, label: 'Seçili değil' },
  ],
};

// 2. Bileşen prop'ları
interface OperationSelectProps {
  filterType: FilterType;
  value: FilterOperations;
  onChange: (value: FilterOperations) => void;
}

const OperationSelect: React.FC<OperationSelectProps> = ({ filterType, value, onChange }) => {
  const options = FILTER_OPERATIONS_MAP[filterType] || [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as FilterOperations);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      // Bu çok önemli: Select'e tıklandığında arkadaki
      // tablo başlığının sıralama (sort) fonksiyonu tetiklenmesin.
      onClick={(e) => e.stopPropagation()} 
      className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-blue-500 focus:ring-blue-500"
    >
      {/* 4. Bulunan seçenekleri ekrana basıyoruz. */}
      {options.map(op => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
};



/* const OperationSelection = ({
  operations,
}: {
  operations: { value: string; label: string }[];
}) => {
  return (
    <select>
      {operations.map((op) => (
        <option value={op.value} key={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}; */

export default OperationSelect;
