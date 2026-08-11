import React from "react";
import { AlertCircle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "An error occurred",
  description = "We couldn't load the requested resource. Please check your connection and try again.",
  onRetry,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-rose-100 rounded-2xl bg-rose-50/55 ${className}`}>
      <div className="p-3 bg-rose-100 rounded-full text-rose-600 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700/80 max-w-sm mb-5">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-rose-200 bg-white hover:bg-rose-50 text-rose-700">
          Try Again
        </Button>
      )}
    </div>
  );
}
