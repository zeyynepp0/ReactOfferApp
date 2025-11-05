import React, { useState, useMemo ,useEffect} from 'react';
import useDebounce from '../hooks/useDebounce';
import type { TableProps, ColumnDef } from "../types/tableTypes"; //runtime bir değeri yok, o yüzden import type kullanmalıyız.
import useSorting from '../hooks/useSorting';
import type {  SelectOption } from '../types/filterTypes';
import { useFilteredData } from '../hooks/useFilteredData';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { useFiltering } from '../hooks/useFiltering';

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
  
  // Sütun görünürlüğü için yeni state
  // Başlangıçta tüm sütunlar görünür (header'larına göre)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(columns.map(c => c.header))
  );


const { filters, handleFilterChange } = useFiltering();

// Veriyi filtrelemeden önce sütunları filtrele (görünür olanları al)
  const filteredColumns = useMemo(() => {
    return columns.filter(c => visibleColumns.has(c.header));
  }, [columns, visibleColumns]);

  // Sütun görünürlüğünü değiştiren fonksiyon
  const toggleColumnVisibility = (header: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(header)) {
        // Son sütunsa gizlemeyi engelle (opsiyonel, ama iyi bir UX)
        if (newSet.size > 1) {
          newSet.delete(header);
        }
      } else {
        newSet.add(header);
      }
      return newSet;
    });
  };



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





useEffect(() => {
  console.log("filters state changed:", filters);
}, [filters]);

 useEffect(() => {
    console.log ("Arama,şu terimle tetiklendi:", debouncedSearchTerm );

  },[debouncedSearchTerm]);

  
  return (
      <div className="bg-white rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)] overflow-x-auto min-h-[400px]">
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
                columns={filteredColumns} // Filtrelenmiş sütunları gönder
                // allColumns={columns} // "Manage columns" için bu prop'a ihtiyaç olacak
                sortConfig={sortConfig}
                handleSort={handleSort}
                filters={filters} // Filtre ikonunu göstermek için filters state'ini gönder
                handleFilterChange={handleFilterChange}
                selectOptionsMap={selectOptionsMap}
                toggleColumnVisibility={toggleColumnVisibility} // Görünürlük fonksiyonunu gönder
                // visibleColumns={visibleColumns} // "Manage columns" için
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
