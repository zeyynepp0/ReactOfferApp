import React from 'react'
export type FilterType = 'text' | 'date' | 'select' | 'number';

export interface ColumnDef<T> {
  header: string;
  fieldKey: keyof T | ((row: T, index: number) => React.ReactNode);
  sortKey?: keyof T;

  filterKey?: keyof T;       // Hangi alan filtrelenecek
  filterType?: FilterType; 
  filterSelectIsMulti?: boolean;
  hideSort?:boolean
}

export interface TableProps<T> {
  columns: ColumnDef<T>[];
  data?: T[];
  emptyDataText?: string;
  onRowClick?: (rowData: T) => void;
}

