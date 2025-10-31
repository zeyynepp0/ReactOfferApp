import { useState, useCallback } from 'react';
import type { FilterCondition } from '../types/filterTypes';


export const useFiltering = (initialFilters: FilterCondition[] = []) => {
  const [filters, setFilters] = useState<FilterCondition[]>(initialFilters);


  const handleFilterChange = useCallback((
    columnId: string, 
    filter: FilterCondition | null
  ) => {
    setFilters(prevFilters => {
      const otherFilters = prevFilters.filter(f => f.columnId !== columnId);
      if (filter) {
        return [...otherFilters, filter];
      }
      return otherFilters;
    });
  }, [setFilters]); 
  

 
  return {
    filters,
    handleFilterChange,
   
  };
};