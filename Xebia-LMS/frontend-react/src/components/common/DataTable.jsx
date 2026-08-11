import React, { useState } from "react";
import Button from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "./EmptyState";

export default function DataTable({
  columns,
  data = [],
  emptyTitle = "No records found",
  emptyDescription = "There are no entries corresponding to the criteria.",
  pageSize = 8
}) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-gray-50/50 text-[10px] font-black text-text-muted uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={col.key || idx} className="px-6 py-4 font-black">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((row, rIdx) => (
              <tr key={row.id || rIdx} className="hover:bg-gray-50/30 transition-colors text-xs font-semibold text-foreground">
                {columns.map((col, cIdx) => (
                  <td key={col.key || cIdx} className="px-6 py-4.5">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50/20">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-bold text-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
