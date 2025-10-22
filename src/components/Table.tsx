import React, { useState, useRef, useMemo } from 'react';
import { FiArrowDown } from "react-icons/fi";
import { FiArrowUp } from "react-icons/fi";

// Arayüz Tanımları
export interface ColumnDef<T> {
  header: string;
  fieldKey: keyof T | ((row: T, index: number) => React.ReactNode);
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data?: T[];
  emptyDataText?: string;
  onRowClick?: (rowData: T) => void;
}

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
  const [inputValue, setInputValue] = useState(''); // Input'un anlık değerini tutar
  const timerRef = useRef<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
      key: null,
      direction: 'asc',
  });  

  // --- Sıralama Tetikleyicisi ---
  const handleSort = (key: keyof T | ((row: T, index: number) => React.ReactNode)) => {
      // Fonksiyon olan sütunlar (örn: buton) sıralanamaz
      if (typeof key === 'function') return; 

      setSortConfig((prev) => {
          if (prev.key === key) {
            // Aynı sütuna tıklandıysa yönü değiştir
            return {
                key,
                direction: prev.direction === 'asc' ? 'desc' : 'asc',
            };
          }
          // Yeni bir sütuna tıklandıysa 'asc' ile başla
          return { key, direction: 'asc' };
     });
  };

  // Arama (Filtreleme) Mantığı 
  // Sadece searchTerm, data veya columns değiştiğinde yeniden hesaplanır.
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (!searchTerm) {
        return true;
      }
      // some: kolonlardan en az biri eşleşirse true döner
      return columns.some((col) => {
        let value: unknown;
        if (typeof col.fieldKey === "function") {
           return false; 
        } else {
          // fieldKey normal bir anahtarsa (string | number)
          value = row[col.fieldKey];
        }
        // Değeri string'e çevir, küçük harfe al ve arama terimini içerip içermediğine bak
        return String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]); // Bağımlılıklar


  // --- Sıralama Mantığı ---
  // Sadece filteredData veya sortConfig değiştiğinde yeniden hesaplanır.
  const sortedData = useMemo(() => {
    const key = sortConfig.key;
    
    // Eğer bir sıralama anahtarı seçilmemişse, sadece filtrelenmiş veriyi döndür
    if (key === null) {
      return filteredData;
    }

    // filteredData'nın bir kopyasını alıp (.sort() orijinal diziyi bozar) sırala
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = a[key as keyof T]; 
      const valueB = b[key as keyof T];

      //  null veya undefined değerleri her zaman en sona at
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;  // a sona gider
      if (valueB == null) return -1; // b sona gider

      let comparison = 0;

      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } 
      else if (valueA instanceof Date && valueB instanceof Date) {
        
        comparison = valueA.getTime() - valueB.getTime(); 
      } 
      else {
        
        comparison = String(valueA).localeCompare(String(valueB));
      }

      
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;

  }, [filteredData, sortConfig]); // Bağımlılıklar


  // --- Input Değişim (Arama) Tetikleyicisi ---
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value); // Input'un görünümünü anlık güncelle
      
      // Debounce: Kullanıcı yazmayı bıraktıktan 500ms sonra aramayı tetikle
      // Önceki timer'ı iptal et
      if(timerRef.current){
          window.clearTimeout(timerRef.current)
      }

      // Yeni timer kur
      timerRef.current = window.setTimeout(()=>{
          //console.warn(`Filtreleme tetiklendi! Arama terimi: "${value}"`);
          setSearchTerm(value); // Asıl filtrelemeyi yapacak state'i güncelle
      }, 500);
  };


  
  return (
      <div className="bg-white rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)] overflow-x-auto">
          {/* Arama Input'u */}
          <input
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 text-sm mb-4"
              type="text"
              placeholder="Ara..."
              value={inputValue}
              onChange={ handleInputChange }
          />
          
          {/* Tablo */}
          <table className="w-full border-collapse ">
              {/* Tablo Başlıkları */}
              <thead>
                  <tr className="bg-slate-200">
                      {columns.map((col, index) => (
                          <th key={`${col.header}-${index}`} 
                              className="bg-slate-200 p-3 text-left font-semibold cursor-pointer select-none" // select-none eklendi
                              onClick={() => handleSort(col.fieldKey)}>
                              
                              <div className="flex items-center space-x-1"> {/* İkon ve metni hizalamak için div */}
                                <span>{col.header}</span>
                                {/* Aktif sıralama ikonu */}
                                {sortConfig.key === col.fieldKey && (
                                    sortConfig.direction === 'asc' 
                                        ? <FiArrowUp className="text-gray-600" /> 
                                        : <FiArrowDown className="text-gray-600" />
                                )}
                              </div>
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