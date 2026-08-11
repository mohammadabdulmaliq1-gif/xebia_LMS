import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  ...props
}) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Dialog */}
      <div
        className={`relative bg-white w-full rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-all duration-300 ${sizeClasses[size]}`}
        {...props}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// Convenient confirmation modal wrapper
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  confirmVariant = "danger",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-foreground">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
