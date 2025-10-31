import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import type { ColumnDef } from "../types/tableTypes";
import type { SortConfig } from '../hooks/useSorting'; // useSorting'den SortConfig'i import ediyoruz
import type { FilterCondition, SelectOption } from '../types/filterTypes';
import TextFilter from './TextFilter';
import NumberFilter from './NumberFilter';
import DateFilter from './DateFilter';
import SelectFilter from './SelectFilter';


interface TableHeaderProps<T> {
  columns: ColumnDef<T>[];
  sortConfig: SortConfig<T>;
  handleSort: (col: ColumnDef<T>) => void;
  handleFilterChange: (columnId: string, filter: FilterCondition | null) => void;
  selectOptionsMap: Map<string, SelectOption[]>;
}


export default function TableHeader<T extends { id: string | number }>(
  { columns, sortConfig, handleSort, handleFilterChange, selectOptionsMap }: TableHeaderProps<T>
) {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.header} className="px-4 py-2 text-left">
            {/* Başlık */}
            <div className="flex items-center justify-between"
                onClick={() => handleSort(col)}>
              <span>{col.header}</span>
              {/* Aktif sıralama ikonu */}
              {col.hideSort ? null : sortConfig.key === (col.sortKey ?? (typeof col.fieldKey === 'string' ? col.fieldKey : null)) && (
                sortConfig.direction === 'asc' 
                  ? <FiArrowUp className="text-gray-600" /> 
                  : <FiArrowDown className="text-gray-600" />
              )}
            </div>

            {/* Filtre Alanı (Bileşenlere devredildi) */}
            {col.filterType === 'text' && col.filterKey && (
              <TextFilter
                columnId={col.filterKey as string}
                onFilterChange={(filter) => 
                  handleFilterChange(col.filterKey as string, filter)
                }
              />
            )}
            {col.filterType === 'number' && col.filterKey && (
              <NumberFilter
                columnId={col.filterKey as string}
                onFilterChange={(filter) => 
                  handleFilterChange(col.filterKey as string, filter)
                }
              />
            )}
            
            {col.filterType === 'date' && col.filterKey && (
              <DateFilter
                columnId={col.filterKey as string}
                onFilterChange={(filter) => 
                  handleFilterChange(col.filterKey as string, filter)
                }
              />
            )}
            {col.filterType === 'select' && col.filterKey && (
              <SelectFilter
                columnId={col.filterKey as string}
                onFilterChange={(filter) => 
                  handleFilterChange(col.filterKey as string, filter)
                }
                options={selectOptionsMap.get(col.filterKey as string) || []}
                isMulti={col.filterSelectIsMulti || false}
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}