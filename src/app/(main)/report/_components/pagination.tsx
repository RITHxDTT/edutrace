"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationBasicProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPaginationItems(currentPage: number, totalPages: number) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  pages.push(1);

  if (currentPage > 4) {
    pages.push("...");
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    pages.push(pageNumber);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export function PaginationBasic({
  page,
  totalPages,
  onPageChange,
}: PaginationBasicProps) {
  if (totalPages <= 1) return null;

  const paginationItems = getPaginationItems(page, totalPages);

  function goToPage(nextPage: number) {
    const validPage = Math.min(Math.max(nextPage, 1), totalPages);
    onPageChange(validPage);
  }

  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2 rounded-2xl  p-2 ">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {paginationItems.map((item, index) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                >
                  ...
                </span>
              );
            }

            const isActive = item === page;

            return (
              <button
                key={item}
                type="button"
                onClick={() => goToPage(item)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#241CAB] text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
