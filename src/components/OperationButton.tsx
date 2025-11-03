import React, { useState , useEffect, useRef} from "react";
import type {  FilterOperations } from '../types/filterTypes'; 
import type { FilterType } from '../types/tableTypes'; 

//Veri yapısına description alanı eklendi
type OperationOption = { 
  value: FilterOperations; 
  label: string; 
  description: string; // Açıklama alanı
};

// MAP güncellendi
const FILTER_OPERATIONS_MAP: Record<FilterType, OperationOption[]> = {
  text: [
    { value: 'contains', label: 'İçerir', description: 'metin içerir' },
    { value: 'notContains', label: 'İçermez', description: 'metin içermez' },
    { value: 'equals', label: 'Eşittir', description: 'tam eşleşme' },
    { value: 'notEquals', label: 'Eşit değildir', description: 'tam eşleşme değil' },
    { value: 'startsWith', label: 'İle başlar', description: 'başlangıç metni' },
    { value: 'endWith', label: 'İle biter', description: 'bitiş metni' },
  ],
  number: [
    { value: 'equals', label: 'Eşittir', description: '=' },
    { value: 'notEquals', label: 'Eşit değildir', description: '≠' },
    { value: 'gt', label: 'Büyüktür', description: '>' },
    { value: 'gte', label: 'Büyük Eşit', description: '>=' },
    { value: 'lt', label: 'Küçüktür', description: '<' },
    { value: 'lte', label: 'Küçük Eşit', description: '<=' },
    { value: 'between', label: 'Arasında', description: 'iki değer arası' },
  ],
  date: [
    { value: 'equals', label: 'Tarih', description: 'tam tarih' },
    { value: 'notEquals', label: 'Eşit değil', description: 'tarih değil' },
    { value: 'gt', label: 'Sonra', description: 'tarihten sonra' },
    { value: 'lt', label: 'Önce', description: 'tarihten önce' },
    { value: 'between', label: 'Arasında', description: 'tarih aralığı' },
  ],
  select: [
    { value: 'is', label: 'Seçili', description: 'listeden seçili' },
    { value: 'isNot', label: 'Seçili değil', description: 'listede değil' },
  ],
};


interface OperationButtonProps {
  filterType: FilterType;
  value: FilterOperations; 
  onChange: (value: FilterOperations) => void;
}

const OperationButton: React.FC<OperationButtonProps> = ({
  filterType,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = FILTER_OPERATIONS_MAP[filterType] || [];

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (newValue: FilterOperations) => {
    setIsOpen(false);
    onChange(newValue);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "Seçim yapın...";


  useEffect(() => {
    // Tıklamayı dinleyecek fonksiyon
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        // Eğer tıklanan yer, bizim bileşenimizin (ref) dışında ise menüyü kapat
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Menü açıksa, document'a tıklama dinleyicisi ekle
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

  return (
    <div className="relative inline-block text-left w-full" 
    onClick={(e) => e.stopPropagation()}
      ref={wrapperRef}>
      
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-blue-500 focus:ring-blue-500 flex items-center justify-between bg-white"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform flex-shrink-0 text-gray-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /> {/* butonun aşağı doğru açılır olduğunu gösteren oku çizer */}
        </svg>
      </button>

     
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          
          
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => handleSelect(option.value)}
              
              className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition flex justify-between items-center"
            >
            
              <span>{option.label}</span>
             
              <span className="text-xs text-gray-500 ml-2">({option.description})</span>
            </button>
          ))}

        </div>
      )}
    </div>
  );
};

export default OperationButton;