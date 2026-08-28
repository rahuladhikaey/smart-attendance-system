import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  itemsPerPage?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  itemsPerPage = 10,
  emptyMessage = 'No records found matching your criteria.',
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filtering
    if (searchTerm.trim() && searchKeys.length > 0) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchKeys.some(key => {
          const val = item[key];
          return val ? String(val).toLowerCase().includes(lower) : false;
        })
      );
    }

    // Sorting
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        const comp = valA < valB ? -1 : 1;
        return sortDirection === 'asc' ? comp : -comp;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0E0E0E]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
          />
        </div>

        {actions && <div className="flex items-center gap-2 w-full sm:w-auto justify-end">{actions}</div>}
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-medium tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx('px-4 py-3 select-none', col.className)}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={clsx('flex items-center gap-1.5', col.sortable && 'cursor-pointer hover:text-white')}>
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="w-3 h-3 opacity-60" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={clsx(
                    'hover:bg-[#141414] transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={clsx('px-4 py-3.5', col.className)}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-neutral-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-[#262626] flex items-center justify-between text-xs text-neutral-400 bg-[#0E0E0E]">
        <div>
          Showing <span className="font-mono text-white">{filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-mono text-white">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of{' '}
          <span className="font-mono text-white">{filteredData.length}</span> results
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-[#141414] border border-[#262626] hover:bg-[#1C1C1C] disabled:opacity-30 disabled:pointer-events-none text-neutral-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-neutral-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded bg-[#141414] border border-[#262626] hover:bg-[#1C1C1C] disabled:opacity-30 disabled:pointer-events-none text-neutral-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
