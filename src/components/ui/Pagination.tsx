import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  const goToPage = (nextPage: number) => {
    onPageChange(Math.min(Math.max(nextPage, 1), pageCount));
  };

  return (
    <div className="flex flex-col gap-3 border-t bg-white px-4 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <span>
          Hiển thị <strong className="text-slate-950">{start}-{end}</strong> / <strong className="text-slate-950">{total}</strong>
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border bg-slate-50 px-2 py-1.5 font-semibold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>{option}/trang</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => goToPage(1)} disabled={currentPage === 1} className="rounded-lg border p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Trang đầu">
          <ChevronsLeft size={16} />
        </button>
        <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Trang trước">
          <ChevronLeft size={16} />
        </button>
        <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-950">
          {currentPage} / {pageCount}
        </span>
        <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount} className="rounded-lg border p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Trang sau">
          <ChevronRight size={16} />
        </button>
        <button type="button" onClick={() => goToPage(pageCount)} disabled={currentPage === pageCount} className="rounded-lg border p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Trang cuối">
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
