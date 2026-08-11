
import React from "react";
import { ChevronLeft } from "lucide-react";

export default function SidebarToggle({ collapsed, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white border border-border hover:border-primary/30 text-foreground hover:text-primary shadow-xs cursor-pointer absolute -right-4 top-6 z-50 transition-all duration-300"
      aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      title={collapsed ? "Expand" : "Collapse"}
    >
      <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
    </button>
  );
}
