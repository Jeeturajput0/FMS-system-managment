import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize,
}) => {
  if (pageCount <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-500">
        Showing{" "}
        <span className="font-bold text-slate-700">
          {start}-{end}
        </span>{" "}
        of <span className="font-bold text-slate-700">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <span className="min-w-16 text-center font-bold text-slate-700">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
