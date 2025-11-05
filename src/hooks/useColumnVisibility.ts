import { useState, useMemo } from 'react';
import type { ColumnDef } from '../types/tableTypes';

export function useColumnVisibility<T>(columns: ColumnDef<T>[]) {
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(columns.map(c => c.header))
  );

  const toggleColumnVisibility = (header: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(header)) next.delete(header); else next.add(header);
      return next;
    });
  };

  const visibleOrdered = useMemo(
    () => (all: ColumnDef<T>[]) => all.filter(c => visibleColumns.has(c.header)),
    [visibleColumns]
  );

  return { visibleColumns, toggleColumnVisibility, visibleOrdered };
}


