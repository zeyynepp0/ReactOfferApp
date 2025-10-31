import React, { useState, useMemo ,useEffect,useCallback} from 'react';
import useDebounce from '../hooks/useDebounce';
import type { TableProps } from "../types/tableTypes"; //runtime bir değeri yok, o yüzden import type kullanmalıyız.
import useSorting from '../hooks/useSorting';
import type { FilterCondition, SelectOption } from '../types/filterTypes';
import { useFilteredData } from '../hooks/useFilteredData';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

// Tablo Component'i
 export function Table<T extends { id: string | number }>(props: TableProps<T>) {
  const {
    columns,
    data = [],
    emptyDataText = "Gösterilecek veri yok",
    onRowClick,
  } = props;
 
  // State'ler
  const [searchTerm, setSearchTerm] = useState('');
  //const [columnFilters, setColumnFilters] = useState<ColumnFilterType<T>>(null)
 
  const [inputValue, setInputValue] = useState(''); // Input'un anlık değerini tutar
  //const debouncedSearchTerm = useDebounce (searchTerm);// otomatik varsayılan değer gelir.
  const debouncedSearchTerm = useDebounce (searchTerm,300);
  


/*   type FilterValue =
  | string
  | string[]
  | {
      start?: string;
      end?: string;
      min?:number;
      max?:number;
    };
const [filters, setFilters] = useState<Record<string, FilterValue>>({}); */

const [filters, setFilters] = useState<FilterCondition[]>([]);

const { filteredData } = useFilteredData(data, columns, filters, debouncedSearchTerm);
const { sortConfig, handleSort, sortedData } = useSorting(filteredData);

const selectOptionsMap = useMemo(() => {
    const map = new Map<string, SelectOption[]>();
    
    columns.forEach(col => {
      if (col.filterType === 'select' && typeof col.filterKey === 'string') {
        const uniqueValues = new Set(data.map(d => (d as any)[col.filterKey!]));
        const options = Array.from(uniqueValues).map(val => ({
          value: String(val),
          label: String(val),
        }));
        map.set(col.filterKey, options);
      }
    });
    return map;
  }, [data, columns]);

  
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=> {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);

  };


  const handleFilterChange = useCallback((
    columnId: string, 
    filter: FilterCondition | null
  ) => {
    
    setFilters(prevFilters => {
      // Artık 'columnId'yi doğrudan parametreden alıyoruz.
      const otherFilters = prevFilters.filter(f => f.columnId !== columnId);
      
      // filter 'null' değilse (yani bir değer varsa) listeye ekle
      if (filter) {
        return [...otherFilters, filter];
      }
      
      // 'null' ise (input temizlendi), filtreyi listeden çıkar
      return otherFilters;
    });
  }, [setFilters]);



useEffect(() => {
  console.log("filters state changed:", filters);
}, [filters]);

 useEffect(() => {
    console.log ("Arama,şu terimle tetiklendi:", debouncedSearchTerm );

  },[debouncedSearchTerm]);

  
  return (
      <div className="bg-white rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)] overflow-x-auto">
          {/* Arama Input'u */}
          
          <input
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 text-sm mb-4"
              type="text"
              placeholder="Arama..."
              value={inputValue}
              onChange={ handleInputChange }
          />
          
          {/* Tablo */}
          <table className="w-full border-collapse ">
              {/* Tablo Başlıkları */}
            <TableHeader
                columns={columns}
                sortConfig={sortConfig}
                handleSort={handleSort}
                handleFilterChange={handleFilterChange}
                selectOptionsMap={selectOptionsMap}
             />


              {/* Tablo Gövdesi */}
             <TableBody
              columns={columns}
              sortedData={sortedData}
              emptyDataText={emptyDataText}
              searchTerm={searchTerm} // 'Anlık' arama terimini mesaj için gönder
              onRowClick={onRowClick}
            />
          </table>
      </div>
      
  );
}
