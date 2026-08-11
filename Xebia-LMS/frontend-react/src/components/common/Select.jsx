import React, { useId } from "react";

export default function Select({
  label,
  id,
  options = [],
  error,
  helperText,
  className = "",
  placeholder,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const baseSelectStyle = "w-full px-3.5 py-2 border rounded-lg text-sm text-foreground bg-white transition-colors duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20";
  const borderStyle = error ? "border-rose-500 focus:border-rose-500" : "border-border";

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${baseSelectStyle} ${borderStyle}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
    </div>
  );
}
