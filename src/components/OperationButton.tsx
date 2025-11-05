import React, { useState , useEffect, useRef} from "react";
import type {  FilterOperations } from '../types/filterTypes'; 
import type { FilterType } from '../types/tableTypes'; 
import OperationButtonTrigger from './OperationButtonTrigger';
import OperationDropdownMenu from './OperationDropdownMenu';

// Sabit veriyi dışarıdan import ediyoruz
import { FILTER_OPERATIONS_MAP } from '../constants/filterConstants';

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
      
      {/* Tetikleyici Buton */}
      <OperationButtonTrigger
        isOpen={isOpen}
        selectedLabel={selectedLabel}
        onClick={() => setIsOpen((prev) => !prev)}
      />
     
      {/*  Menü ve İçerik (Menu, Item'ları içinde render ediyor) */}
      <OperationDropdownMenu
        isOpen={isOpen}
        options={options}
        onSelect={handleSelect}
      />
      
    </div>
  );
};

export default OperationButton;