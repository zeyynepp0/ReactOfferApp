import React, { useState, useRef, useMemo ,useEffect} from 'react';
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import Select from 'react-select';
//import DatePicker from "react-datepicker";


// Arayüz Tanımları
export interface ColumnDef<T> {
  header: string;
  fieldKey: keyof T | ((row: T, index: number) => React.ReactNode);
  sortKey?: keyof T;

  filterKey?: keyof T;       // Hangi alan filtrelenecek
  filterType?: 'text' | 'date' | 'select'; // Filtre tipi
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data?: T[];
  emptyDataText?: string;
  onRowClick?: (rowData: T) => void;
}

type FilterValue =
  | string
  | string[]
  | {
      start?: string;
      end?: string;
    };

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
  //const [searchColumnTerm, setSearchColumnTerm] = useState('');
  const [inputValue, setInputValue] = useState(''); // Input'un anlık değerini tutar
  const timerRef = useRef<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
      key: null,
      direction: 'asc',
  });  
const [filters, setFilters] = useState<Record<string, string | string[]>>({});
//const [startDate, setStartDate] = useState<string>("");
//const [endDate, setEndDate] = useState<string>("");
//const [openDateDropdown, setOpenDateDropdown] = useState(false);





//Sıralama Tetikleyicisi 
const handleSort = (col: ColumnDef<T>) => { // <-- Parametreyi 'key' yerine 'col' objesi olarak değiştirin
    
    // Sıralama için kullanılacak anahtarı belirle: Önce sortKey'e bak,
    // o yoksa ve fieldKey string ise fieldKey'i kullan.
    const keyToSortBy = col.sortKey ?? (typeof col.fieldKey === 'string' ? col.fieldKey : null);

    // Sıralanacak bir anahtar bulunamazsa (örn: fieldKey fonksiyon ve sortKey yoksa) işlemi durdur
    if (keyToSortBy === null) return; 

    setSortConfig((prev) => {
        if (prev.key === keyToSortBy) { // keyToSortBy değişkenini kullan
          // Aynı sütuna tıklandıysa yönü değiştir
          return {
              key: keyToSortBy, // keyToSortBy değişkenini kullan
              direction: prev.direction === 'asc' ? 'desc' : 'asc',
          };
        }
        // Yeni bir sütuna tıklandıysa 'asc' ile başla
        return { key: keyToSortBy, direction: 'asc' }; // keyToSortBy değişkenini kullan
   });
};

  
const filteredData = useMemo(() => {
  return data.filter((row) => {
    //  Genel arama: satırdaki herhangi bir değer searchTerm'i içeriyor mu?
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
      if (!value) return true;

       const cellValue = row[key as keyof T];
      /*if (col.filterType === 'date') { 
        return String(cellValue).startsWith(value);
        
      } */
      

        //Tarih filtrelemesi
        if (col.filterType === 'date') {
           //const [date, setDate] = useState(new Date());
        //const [startDate, setStartDate] = useState();
        //const [endDate, setEndDate] = useState();
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



       // Çoklu seçim: bir dizide var mı diye kontrol et 
          if (Array.isArray(value)) {
          return value.includes(String(cellValue));
        }

      //metin filtreleme
      return String(cellValue ?? "")
        .toLowerCase()
        .includes(value.toLowerCase());
    });

    // 🔄 Her ikisini de birleştir
    return matchesGlobalSearch && matchesColumnFilters;
  });
}, [data, columns, filters, searchTerm]);




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

 const handleColumnFilterChange = (key: string, value: string | string[]) => {
  setFilters((prev) => ({ ...prev, [key]: value }));
};

const handleDateRangeChange = (
    key: string,
    part: 'start' | 'end',
    value: string
  ) => {
    setFilters((prev) => {
      // Önceki tarih filtresi değerlerini al (veya boş obje)
      const currentFilter = (prev[key] || {}) as {
        start?: string;
        end?: string;
      };
      
      // 'start' veya 'end' kısmını güncelle
      const newFilter = {
        ...currentFilter,
        [part]: value,
      };

      // State'i güncelle
      return {
        ...prev,
        [key]: newFilter,
      };
    });
  };

useEffect(() => {
  console.log("filters state changed:", filters);
}, [filters]);

  
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
                                {sortConfig.key === (col.sortKey ?? (typeof col.fieldKey === 'string' ? col.fieldKey : null)) && (
                            sortConfig.direction === 'asc' 
                                        ? <FiArrowUp className="text-gray-600" /> 
                                        : <FiArrowDown className="text-gray-600" />
                                )}
        </div>

        {/*  Filtre alanı */}
        {col.filterType === 'text' && (
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 w-full text-sm mt-1 "
            placeholder={`${col.header} ara...`}
            value={filters[col.filterKey as string] ?? ""}
            onChange={(e) =>
              handleColumnFilterChange(col.filterKey as string, e.target.value)
              
            }
          />
        )}

{col.filterType === 'date' && (
  <div className="mt-2 space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
    {/* Başlık */}
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium text-gray-700">Tarih Aralığı</h4>
      {/* Temizleme Butonu */}
      {(filters[col.filterKey as string] as { start?: string })?.start || 
       (filters[col.filterKey as string] as { end?: string })?.end ? (
        <button
          type="button"
          onClick={() => handleDateRangeClear(col.filterKey as string)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Temizle
        </button>
      ) : null}
    </div>

    {/* Tarih Seçim Alanları */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Başlangıç Tarihi */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 block">
          Başlangıç Tarihi
        </label>
        <div className="relative">
          <input
            type="date"
            className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={(filters[col.filterKey as string] as { start?: string })?.start ?? ''}
            onChange={(e) => handleDateRangeChange(col.filterKey as string, 'start', e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bitiş Tarihi */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 block">
          Bitiş Tarihi
        </label>
        <div className="relative">
          <input
            type="date"
            className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={(filters[col.filterKey as string] as { end?: string })?.end ?? ''}
            onChange={(e) => handleDateRangeChange(col.filterKey as string, 'end', e.target.value)}
            min={(filters[col.filterKey as string] as { start?: string })?.start || ''}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* Seçilen Tarih Gösterimi */}
    {((filters[col.filterKey as string] as { start?: string })?.start || 
      (filters[col.filterKey as string] as { end?: string })?.end) && (
      <div className="text-xs text-gray-100 bg-white p-2 rounded border">
        <span className="font-medium">Seçilen: </span>
        {(filters[col.filterKey as string] as { start?: string })?.start || 'Başlangıç yok'} 
        {' - '} 
        {(filters[col.filterKey as string] as { end?: string })?.end || 'Bitiş yok'}
      </div>
    )}
  </div>
)}
        
        {col.filterType === 'select' && (
          <div className="filter-select-container ">
  <Select
    isMulti
    options={[...new Set(data.map((d) => d[col.filterKey as keyof T]))].map(val => ({
      value: String(val),
      label: String(val)
    }))}
    value={
      (filters[col.filterKey as string] as string[] | undefined)?.map(v => ({
        value: v,
        label: v
      })) || []
    }
    onChange={(selectedOptions) =>
      handleColumnFilterChange(
        col.filterKey as string,
        (selectedOptions as { value: string; label: string }[]).map(opt => opt.value)
      )
    }
    className="basic-multi-select mt-1  "
    classNamePrefix="select"
      menuPosition="fixed"
      menuPlacement="auto"
  /></div>
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