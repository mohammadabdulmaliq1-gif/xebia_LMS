import React from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export default function Toast({ message, type = "info", onClose }) {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        };
      case "error":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-800",
          icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        };
      case "info":
      default:
        return {
          bg: "bg-sky-50 border-sky-200 text-sky-800",
          icon: <Info className="w-5 h-5 text-sky-600" />,
        };
    }
  };

  const { bg, icon } = getStyles();

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${bg} transition-all duration-300 transform translate-y-0`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-foreground/50 hover:text-foreground p-0.5 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
