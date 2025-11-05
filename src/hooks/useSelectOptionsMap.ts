import { useMemo } from 'react';
import type { ColumnDef } from '../types/tableTypes';
import type { SelectOption } from '../types/filterTypes';

export function useSelectOptionsMap<T>(columns: ColumnDef<T>[], data: T[]) {
  const selectOptionsMap = useMemo(() => {
    const map = new Map<string, SelectOption[]>();
    for (const col of columns) {
      if (col.filterType === 'select' && col.filterKey) {
        const key = col.filterKey as string;
        const values = Array.from(new Set((data as any[]).map(r => (r as any)[key]).filter(v => v != null)));
        map.set(
          key,
          values.map(v => ({ value: String(v), label: String(v) }))
        );
      }
    }
    return map;
  }, [columns, data]);

  return selectOptionsMap;
}


