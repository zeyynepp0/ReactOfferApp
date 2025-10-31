import type { FilterType } from './tableTypes';

export type TextOperation = 'contains' | 'notContains' |'equals' |'notEquals' | 'startsWith' | 'endWith';
export type NumberOperation = 'equals' | 'notEquals' | 'gt' | 'gte' | 'lt' | 'lte' | 'between';
export type DateOperation = 'equals' | 'notEquals' | 'gt' | 'gte' | 'lt' | 'lte' | 'between';
export type SelectOperation = 'is' | 'isNot';

export type FilterOperations= TextOperation | NumberOperation |DateOperation|SelectOperation;

//string[] = select için , from: string | number, to: string | number = between için , string | number= diğerleri için
export type FilterValue = string | number | string[] | { from: string | number, to: string | number } | null;

export interface FilterCondition {
  columnId: string;
  filterType: FilterType;
  operation: FilterOperations;
  value: FilterValue;
}

// React-Select için basit bir seçenek tipi
export interface SelectOption {
  value: string;
  label: string;
}