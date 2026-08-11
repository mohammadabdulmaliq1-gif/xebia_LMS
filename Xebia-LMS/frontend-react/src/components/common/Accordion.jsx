
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Accordion({
  title,
  subtitle,
  children,
  defaultOpen = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-border rounded-xl bg-white overflow-hidden shadow-xs ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors duration-150 outline-none"
      >
        <div className="flex-1 min-w-0 pr-4">
          <span className="font-bold text-foreground text-sm block truncate">{title}</span>
          {subtitle && (
            <span className="text-xs text-text-muted mt-0.5 block truncate font-medium">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 text-foreground/50">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapse Panel */}
      {isOpen && (
        <div className="border-t border-border bg-gray-50/30 p-4 transition-all duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
