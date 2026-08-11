import React from "react";
import Card, { CardBody } from "./Card";

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
  description,
  variant = "credit", // Default to premium credit card style!
  gradientScheme = "primary" // primary, emerald, blue, orange
}) {
  const isUp = trendDirection === "up";
  const isCredit = variant === "credit";
  
  const titleClass = isCredit ? "text-white/70" : "text-text-muted";
  const valueClass = isCredit ? "text-white" : "text-foreground";
  const descClass = isCredit ? "text-white/50" : "text-text-muted";
  const iconBg = isCredit ? "bg-white/10 text-white" : "bg-primary/5 text-primary";
  const trendLabelClass = isCredit ? "text-white/40" : "text-text-muted";

  return (
    <Card
      variant={variant}
      gradientScheme={gradientScheme}
      hoverable
      className={isCredit ? "border-white/10" : "border-border"}
    >
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${titleClass}`}>{title}</span>
            <h3 className={`text-2xl font-black tracking-tight ${valueClass}`}>{value}</h3>
            {description && <p className={`text-[10px] font-semibold ${descClass}`}>{description}</p>}
          </div>
          {Icon && (
            <div className={`p-3 rounded-xl flex-shrink-0 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
            <span className={isUp ? (isCredit ? "text-emerald-300 font-bold" : "text-emerald-600") : (isCredit ? "text-rose-300 font-bold" : "text-rose-600")}>{trend}</span>
            <span className={`text-[10px] uppercase font-bold ${trendLabelClass}`}>vs last month</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
