import { useMemo, useState } from 'react';
import type { ColumnDef } from '../types/tableTypes';

export function useColumnOrder<T>(columns: ColumnDef<T>[]) {
  const [columnOrder, setColumnOrder] = useState<string[]>(
    () => columns.map(c => c.header)
  );

  const orderedAllColumns: ColumnDef<T>[] = useMemo(() => {
    const byHeader = new Map(columns.map(c => [c.header, c] as const));
    return columnOrder.map(h => byHeader.get(h)).filter(Boolean) as ColumnDef<T>[];
  }, [columns, columnOrder]);

  const reorder = (activeId: string, overId: string) => {
    setColumnOrder(prev => {
      const from = prev.indexOf(activeId);
      const to = prev.indexOf(overId);
      if (from === -1 || to === -1) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  };

  return { columnOrder, setColumnOrder, orderedAllColumns, reorder };
}


