import React, { useState, useMemo ,useEffect,useCallback} from 'react';
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import useDebounce from '../hooks/useDebounce';
import type { ColumnDef, TableProps } from "../types/tableTypes"; //runtime bir değeri yok, o yüzden import type kullanmalıyız.
import useSorting from '../hooks/useSorting';
import type { FilterCondition, SelectOption } from '../types/filterTypes';
import { useFilteredData } from '../hooks/useFilteredData';
import TextFilter from './TextFilter';
import NumberFilter from './/NumberFilter';
import DateFilter from './DateFilter';
import SelectFilter from './SelectFilter';


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

/* const filteredData = useMemo(() => {
  return data.filter((row) => {

    //  Genel arama: satırdaki herhangi bir değer searchTerm'i içeriyor mu
    const matchesGlobalSearch = searchTerm
      ? columns.some((col) => {
          if (typeof col.fieldKey === 'function') return false;
          const cellValue = row[col.fieldKey];
          return String(cellValue ?? '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      : true; // searchTerm boşsa tüm satırlar geçer


    //Kolon bazlı filtreleme
    const matchesColumnFilters = columns.every((col) => {
      const key = col.filterKey as string;
   

      const value = filters[key];

    if (col.filterType !== 'number' && col.filterType !== 'date') { 
      if (!value) return true;
    }

       const cellValue = row[key as keyof T];
  
     
    
        if (col.filterType === 'select') {
         if (Array.isArray(value)) {
            if (value.length === 0) return true; 

            return value.includes(String(cellValue));
         }
         return true; 
      }
      
if (col.filterType === 'number') {
            const minFilterKey = `${key}_min`;
            const maxFilterKey = `${key}_max`;

            const minStr = filters[minFilterKey] as string | undefined;
            const maxStr = filters[maxFilterKey] as string | undefined;

            // Satır değerini sayıya dönüştür
            const cellNumValue = Number(row[key as keyof T]);

            // Filtre değerlerini parse et, boş stringleri -Infinity veya Infinity olarak ayarla
            // Bu sayede sadece bir limit girilse bile doğru çalışır
            const minVal = (minStr && minStr.trim() !== '') ? Number(minStr) : -Infinity;
            const maxVal = (maxStr && maxStr.trim() !== '') ? Number(maxStr) : Infinity;

            // Eğer hiç filtre girilmemişse (varsayılan değerler -Infinity ve Infinity)
            if (minVal === -Infinity && maxVal === Infinity) return true;

            // Geçersiz sayısal değerler için kontrol
            if (isNaN(cellNumValue) || isNaN(minVal) || isNaN(maxVal)) return true;

            // Filtreleme koşulu: hücre değeri [minVal, maxVal] aralığında olmalı
            return cellNumValue >= minVal && cellNumValue <= maxVal;
       }



        //Tarih filtrelemesi
        if (col.filterType === 'date') {
            if (typeof value !== 'object' || Array.isArray(value) || !value) {
            return true;
          }

         const dateFilter = value as { start?: string; end?: string };
          const { start, end } = dateFilter;

          // Eğer başlangıç ve bitiş tarihi girilmemişse, bu filtreyi pas geç
          if (!start && !end) return true;

          // Hücredeki tarihi parse et
          const rowDate = new Date(cellValue as string);
          // Geçerli bir tarih değilse, filtreleme dışı bırakma (veya isteğe bağlı olarak bırak)
          if (isNaN(rowDate.getTime())) return true;

          // Başlangıç tarihinden küçük mü kontrolü
          if (start) {
            const startDate = new Date(start);
            if (rowDate < startDate) return false;
          }

          // Bitiş tarihinden büyük mü kontrolü
          if (end) {
            const endDate = new Date(end);
            // Kullanıcının seçtiği günü TAMAMEN (23:59:59) dahil et
            endDate.setHours(23, 59, 59, 999);
            if (rowDate > endDate) return false;
          }

            
          return true;
}         



      

      //metin filtreleme
      if (col.filterType === 'text') {
        if (typeof value === 'string') {
      return String(cellValue ?? "")
        .toLowerCase()
        .includes(value.toLowerCase());
        }
        return true;
    }});

    // 🔄 Her ikisini de birleştir
    return matchesGlobalSearch && matchesColumnFilters;
  });
}, [data, columns, filters, searchTerm]); */

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


  const handleFilterChange =useCallback( (filter: FilterCondition | null) => {
    setFilters(prevFilters => {
      const otherFilters = prevFilters.filter(f => f.columnId !== filter?.columnId);
      
      // Eğer filter 'null' değilse (yani geçerli bir değer varsa) listeye ekle
      if (filter) {
        return [...otherFilters, filter];
      }
      
      // 'null' ise (örn: input temizlendi), filtreyi listeden çıkar
      return otherFilters;
    });
  },[]);



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
                          onFilterChange={handleFilterChange}
                        />
                      )}
                      {col.filterType === 'number' && col.filterKey && (
                        <NumberFilter
                          columnId={col.filterKey as string}
                          onFilterChange={handleFilterChange}
                        />
                      )}
                      {col.filterType === 'date' && col.filterKey && (
                        <DateFilter
                          columnId={col.filterKey as string}
                          onFilterChange={handleFilterChange}
                        />
                      )}
                      {col.filterType === 'select' && col.filterKey && (
                        <SelectFilter
                          columnId={col.filterKey as string}
                          onFilterChange={handleFilterChange}
                          options={selectOptionsMap.get(col.filterKey as string) || []}
                          isMulti={col.filterSelectIsMulti || false} // types'tan gelen yeni prop
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>


              {/* Tablo Gövdesi */}
              <tbody>
                  
                  {sortedData.length === 0 ? (
                      <tr>
                          <td colSpan={columns.length} className="text-center text-gray-500 p-4">
                              {/* Arama terimi varsa yoksa mesajı yazdır */}
                              {searchTerm 
                                ? "Arama sonucuyla eşleşen veri bulunamadı" 
                                : emptyDataText
                              }
                          </td>
                      </tr>
                  ) : (
                      
                      sortedData.map((row, rowIndex) => (
                          <tr
                              key={row.id}
                              onClick={() => onRowClick && onRowClick(row)}
                              className={onRowClick ? "cursor-pointer hover:bg-gray-100 transition" : ""}
                          >
                              {columns.map((col, colIndex) => (
                                  <td key={`${col.header}-${colIndex}`} className="p-3 border-b border-slate-100">
                                      
                                      {/* Hücre içeriğini render et */}
                                      {typeof col.fieldKey === "function"
                                          ? col.fieldKey(row, rowIndex) // Fonksiyon ise çalıştır (örn: buton)
                                          : String(row[col.fieldKey] ?? "") // Değilse değeri string olarak bas
                                      }
                                      
                                  </td>
                              ))}
                          </tr>
                      ))
                  )}
              </tbody>
          </table>
      </div>
      
  );
}
