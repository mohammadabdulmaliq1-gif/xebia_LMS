import React from "react";
import Breadcrumbs from "./Breadcrumbs";

export default function PageHeader({ title, description, actions, breadcrumbs }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
      <div className="space-y-1">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-2xl font-black text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-xs text-text-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  );
}
