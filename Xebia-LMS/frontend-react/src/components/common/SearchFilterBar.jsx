import React from "react";
import { Search, X } from "lucide-react";

export default function SearchFilterBar({
  search,
  onSearchChange,
  filters = [],
  onClear,
  placeholder = "Search..."
}) {
  const hasActiveFilters = search || filters.some(f => f.value && f.value !== "All" && f.value !== "");

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-border bg-gray-50/30 rounded-xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            value={search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 bg-white transition-all"
          />
        </div>

        {/* Filter Selects */}
        {filters.map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50 cursor-pointer min-w-[140px]"
          >
            {filter.placeholder && <option value="All">{filter.placeholder}</option>}
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Clear Button */}
      {hasActiveFilters && onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-dashed border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none"
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}
