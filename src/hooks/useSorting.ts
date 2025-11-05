import {useState, useMemo} from 'react'
import type { ColumnDef} from "../types/tableTypes"; //runtime bir değeri yok, o yüzden import type kullanmalıyız.

export interface SortConfig<T> {
  key: keyof T | null;
  direction: "asc" | "desc";
}

export default function useSorting<T>(data: T[]) {//T tipinin ne olduğunu belirtmek için <T> (generic) kullanıyoruz.
  //sıralama state'i
    const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
      key: null,
      direction: 'asc',
  
    });

   const handleSort = (col: ColumnDef<T>, direction?: 'asc' | 'desc') => { // <-- Parametreyi 'key' yerine 'col' objesi olarak değiştirin
      if(col.hideSort){
        return;
      }
      // Sıralama için kullanılacak anahtarı belirle: Önce sortKey'e bak,
      // o yoksa ve fieldKey string ise fieldKey'i kullan.
      const keyToSortBy = col.sortKey ?? (typeof col.fieldKey === 'string' ? col.fieldKey : null);
  
      // Sıralanacak bir anahtar bulunamazsa (örn: fieldKey fonksiyon ve sortKey yoksa) işlemi durdur
      if (keyToSortBy === null) return; 
  
      /* setSortConfig((prev) => {
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
    }; */
    setSortConfig((prev) => {
          // Eğer menüden 'asc' veya 'desc' gibi net bir yön bilgisi geldiyse, onu ayarla
          if (direction) {
             return { key: keyToSortBy, direction: direction };
          }
          
          // Eğer yön bilgisi gelmediyse (başlığa tıklandıysa), eski toggle mantığını uygula
          if (prev.key === keyToSortBy) { // keyToSortBy değişkenini kullan
            return {
                key: keyToSortBy, // keyToSortBy değişkenini kullan
                direction: prev.direction === 'asc' ? 'desc' : 'asc', // Toggle
            };
          }
          // Yeni bir sütuna tıklandıysa 'asc' ile başla
          return { key: keyToSortBy, direction: 'asc' }; // keyToSortBy değişkenini kullan
        });
    };


  const sortedData = useMemo (()=> {
      if (!sortConfig.key) return data;

      const key = sortConfig.key;
      
      return[... data].sort((a,b)=>{ 
      const valueA =a[key];
      const valueB =b[key];
    
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
},[data, sortConfig]);
 
return {sortConfig, handleSort, sortedData};
}

