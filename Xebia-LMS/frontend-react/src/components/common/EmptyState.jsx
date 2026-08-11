import React from "react";
import { Info } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "No items found",
  description = "Get started by creating a new entry or adjusting your filters.",
  icon: Icon = Info,
  actionText,
  onActionClick,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-2xl bg-white/50 ${className}`}>
      <div className="p-3 bg-gray-100 rounded-full text-foreground/50 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-5">{description}</p>
      {actionText && onActionClick && (
        <Button variant="primary" size="sm" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
