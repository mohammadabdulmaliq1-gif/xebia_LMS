import React, { useId } from "react";

export default function Input({
  label,
  id,
  type = "text",
  error,
  helperText,
  className = "",
  textarea = false,
  rows = 3,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const baseInputStyle = "w-full px-3.5 py-2 border rounded-lg text-sm text-foreground placeholder:text-gray-400 bg-white transition-colors duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20";
  const borderStyle = error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-border";

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          id={inputId}
          rows={rows}
          className={`${baseInputStyle} ${borderStyle} resize-none`}
          suppressHydrationWarning={true}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          className={`${baseInputStyle} ${borderStyle}`}
          suppressHydrationWarning={true}
          {...props}
        />
      )}
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
    </div>
  );
}
