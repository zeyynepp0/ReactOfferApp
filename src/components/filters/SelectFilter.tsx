import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import type { FilterCondition, SelectOperation, SelectOption } from '../../types/filterTypes';
import OperationButton from './OperationButton';

interface SelectFilterProps {
  columnId: string;
  onFilterChange: (filter: FilterCondition | null) => void;
  options: SelectOption[];
  isMulti: boolean;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ columnId, onFilterChange, options }) => {
  const [operation, setOperation] = useState<SelectOperation>('is');
  const [value, setValue] = useState<SelectOption[] | SelectOption | null>(null);

  useEffect(() => {
    let filterValue: string[] | null = null;
    
    if (Array.isArray(value)) {
      filterValue = value.map(v => v.value);
    } else if (value) {
      filterValue = [(value as SelectOption).value];
    }

    if (filterValue && filterValue.length > 0) {
      onFilterChange({
        columnId,
        filterType: 'select',
        operation,
        value: filterValue,
      });
    } else {
      onFilterChange(null); // Seçim boşsa filtreyi kaldır
    }
  }, [value, operation, columnId]);

  return (
    <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
      <OperationButton
        filterType="select"
        value={operation}
        onChange={(op) => setOperation(op as SelectOperation)}
      />
      <Select
        isMulti={true}
        options={options}
        value={value}
        onChange={(selected) => setValue(selected as any)}
        className="basic-multi-select text-sm"
        classNamePrefix="select"
        menuPosition="fixed"
        menuPlacement="auto"
      />
    </div>
  );
};

export default SelectFilter;