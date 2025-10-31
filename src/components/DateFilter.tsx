/* import OperationSelection from "./OperationSelection";
import type { ColumnFilterValue } from "./Table";


const DateFilter = ({onValueChange}:{
  onValueChange:(val:string, operationType:ColumnFilterValue['operationType']) => void
}) => {
  return (
    <div>
      <input type="date" onChange={(e) => {
        onValueChange(e.target.value, "eq")
      }} />


      <OperationSelection
      
        operations={[
          {
            value: "eq",
            label: "Eşittir",
          },
           {
            value: "gte",
            label: "Büyük eşittir",
          },
        ]}
      />


    </div>
  );
};

export default DateFilter;
 */

import React, { useState, useEffect } from 'react';
import type { FilterCondition, DateOperation } from '../types/filterTypes';
import OperationSelect from './OperationSelection';

interface DateFilterProps {
  columnId: string;
  onFilterChange: (filter: FilterCondition | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ columnId, onFilterChange }) => {
  const [operation, setOperation] = useState<DateOperation>('equals');
  const [value, setValue] = useState<string | { from: string, to: string }>('');

  useEffect(() => {
    let filterValue: FilterCondition['value'] = null;
    let isValid = false;

    if (operation === 'between') {
      const { from, to } = value as { from: string, to: string };
      if (from && to) {
        filterValue = { from, to };
        isValid = true;
      }
    } else {
      if (value && typeof value === 'string' && value !== '') {
        filterValue = value;
        isValid = true;
      }
    }

    if (isValid) {
      onFilterChange({
        columnId,
        filterType: 'date',
        operation,
        value: filterValue,
      });
    } else {
      onFilterChange(null);
    }
  }, [value, operation, columnId]);

  const handleOperationChange = (op: DateOperation) => {
    setOperation(op);
    if (op === 'between') {
      setValue({ from: '', to: '' });
    } else {
      setValue('');
    }
  };

  return (
    <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
      <OperationSelect
        filterType="date"
        value={operation}
        onChange={(op) => handleOperationChange(op as DateOperation)}
      />
      {operation === 'between' ? (
        <div className="space-y-2">
          <input
            type="date"
            className="border border-gray-300 rounded-md p-2 w-full text-sm"
            value={(value as { from: string }).from}
            onChange={(e) => setValue({ ...(value as { from: string, to: string }), from: e.target.value })}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-md p-2 w-full text-sm"
            value={(value as { to: string }).to}
            onChange={(e) => setValue({ ...(value as { from: string, to: string }), to: e.target.value })}
          />
        </div>
      ) : (
        <input
          type="date"
          className="border border-gray-300 rounded-md p-2 w-full text-sm"
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </div>
  );
};

export default DateFilter;