import React from "react";

export default function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
  variant = "default", // "default" or "credit"
  gradientScheme = "primary", // "primary", "emerald", "blue", "orange"
  ...props
}) {
  const isClickable = !!onClick;
  
  const baseClass = "rounded-2xl overflow-hidden transition-all duration-300 border";
  
  const variantClasses = {
    default: "bg-white border-border shadow-xs",
    credit: `text-white border-white/10 shadow-lg relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)] before:pointer-events-none`,
  };

  const gradientClasses = {
    primary: "bg-gradient-to-br from-[#4A1E47] via-[#6C1D5F] to-[#84117C]",
    emerald: "bg-gradient-to-br from-[#4A1E47] via-[#01AC9F] to-[#855889]",
    blue: "bg-gradient-to-br from-[#533754] via-[#91759E] to-[#DADCEA]",
    orange: "bg-gradient-to-br from-[#4A1E47] via-[#FF6200] to-[#84117C]",
  };

  const hoverClass = hoverable || isClickable
    ? variant === "credit"
      ? "hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
      : "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    : "";

  const finalBg = variant === "credit" ? gradientClasses[gradientScheme] : variantClasses.default;

  return (
    <div
      className={`${baseClass} ${variant === "credit" ? variantClasses.credit : ""} ${finalBg} ${hoverClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-border/10 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return (
    <div className={`p-6 relative z-10 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-t border-border/10 bg-black/5 ${className}`}>
      {children}
    </div>
  );
}
