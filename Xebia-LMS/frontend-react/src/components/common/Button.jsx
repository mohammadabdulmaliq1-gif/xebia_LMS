import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary/50",
    secondary: "bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary/50",
    accent: "bg-accent hover:bg-accent/90 text-white focus:ring-accent/50",
    cta: "bg-cta hover:bg-cta/90 text-white focus:ring-cta/50",
    outline: "border border-border text-foreground hover:bg-black/5 focus:ring-primary/20",
    ghost: "text-foreground hover:bg-black/5 focus:ring-primary/20",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
