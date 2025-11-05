// src/constants/filterConstants.ts
import type { FilterType } from '../types/tableTypes';
import type { OperationOption } from '../types/filterTypes';

export const FILTER_OPERATIONS_MAP: Record<FilterType, OperationOption[]> = {
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