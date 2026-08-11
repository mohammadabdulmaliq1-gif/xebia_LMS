import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3 h-3 text-foreground/30 flex-shrink-0" />}
            {isLast ? (
              <span className="text-primary truncate">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors truncate">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
