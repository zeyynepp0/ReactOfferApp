import { useMemo } from 'react';
import type { FilterCondition } from '../types/filterTypes';

// --- Filtre Uygulama Yardımcı Fonksiyonları ---

function applyTextFilter(cellValue: any, op: string, filterValue: any): boolean {
  const cell = String(cellValue ?? '').toLowerCase();
  const filter = String(filterValue ?? '').toLowerCase();
  switch (op) {
    case 'contains': return cell.includes(filter);
    case 'notContains': return !cell.includes(filter);
    case 'equals': return cell === filter;
    case 'notEquals': return cell !== filter;
    case 'startsWith': return cell.startsWith(filter);
    case 'endsWith': return cell.endsWith(filter);
    default: return true;
  }
}

function applyNumberFilter(cellValue: any, op: string, filterValue: any): boolean {
  const cell = Number(cellValue);
  if (isNaN(cell)) return false;

  switch (op) {
    case 'equals': return cell === Number(filterValue);
    case 'notEquals': return cell !== Number(filterValue);
    case 'gt': return cell > Number(filterValue);
    case 'gte': return cell >= Number(filterValue);
    case 'lt': return cell < Number(filterValue);
    case 'lte': return cell <= Number(filterValue);
    case 'between':
      const { from, to } = filterValue as { from: number, to: number };
      return cell >= from && cell <= to;
    default: return true;
  }
}

function applyDateFilter(cellValue: any, op: string, filterValue: any): boolean {
  const cell = new Date(cellValue);
  if (isNaN(cell.getTime())) return false;
  // Saat farklarından kaçınmak için tarihleri sıfırlıyoruz
  cell.setHours(0, 0, 0, 0);

  try {
    switch (op) {
      case 'equals':
        const filterDate = new Date(filterValue);
        filterDate.setHours(0, 0, 0, 0);
        return cell.getTime() === filterDate.getTime();
      case 'notEquals':
        const notEqDate = new Date(filterValue);
        notEqDate.setHours(0, 0, 0, 0);
        return cell.getTime() !== notEqDate.getTime();
      case 'gt':
        const gtDate = new Date(filterValue);
        gtDate.setHours(0, 0, 0, 0);
        return cell.getTime() > gtDate.getTime();
      case 'lt':
         const ltDate = new Date(filterValue);
         ltDate.setHours(0, 0, 0, 0);
        return cell.getTime() < ltDate.getTime();
      case 'between':
        const { from, to } = filterValue as { from: string, to: string };
        const fromDate = new Date(from);
        const toDate = new Date(to);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        return cell.getTime() >= fromDate.getTime() && cell.getTime() <= toDate.getTime();
      default: return true;
    }
  } catch (e) {
    return true; // Hatalı tarih formatı varsa filtreleme yapma
  }
}

function applySelectFilter(cellValue: any, op: string, filterValue: string[]): boolean {
  const cell = String(cellValue);
  const isIncluded = filterValue.includes(cell);
  switch (op) {
    case 'is': return isIncluded;
    case 'isNot': return !isIncluded;
    default: return true;
  }
}


export function useFilteredData<T>(
  data: T[],
  columns: any, // 'columns' parametresini ekledik
  filters: FilterCondition[],
  searchTerm: string
) {
  const filteredData = useMemo(() => {
    let filtered = [...data];

    //  Genel Arama 
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((row) => {
        return columns.some((col: any) => {
          if (typeof col.fieldKey === 'function') return false;
          const cellValue = (row as any)[col.fieldKey];
          return String(cellValue ?? '').toLowerCase().includes(lowerSearchTerm);
        });
      });
    }

    //  Kolon Bazlı Filtreler 
    if (filters.length > 0) {
      filtered = filtered.filter(row => {
        // Her satır, TÜM aktif filtre koşullarını sağlamalı (every)
        return filters.every(filter => {
          const cellValue = (row as any)[filter.columnId];
          
          switch (filter.filterType) {
            case 'text':
              return applyTextFilter(cellValue, filter.operation, filter.value);
            case 'number':
              return applyNumberFilter(cellValue, filter.operation, filter.value);
            case 'date':
              return applyDateFilter(cellValue, filter.operation, filter.value);
            case 'select':
              return applySelectFilter(cellValue, filter.operation, filter.value as string[]);
            default:
              return true; // Bilinmeyen filtre tipi
          }
        });
      });
    }

    return filtered;
  }, [data, columns, filters, searchTerm]);

  return { filteredData };
}