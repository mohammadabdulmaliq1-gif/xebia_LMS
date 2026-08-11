import React from "react";
import { Link } from "react-router-dom";

export default function SidebarLogo({ collapsed, onClick }) {
  return (
    <div className="h-16 flex items-center px-4 border-b border-border/50 shrink-0">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-3 hover:opacity-90 transition-opacity w-full"
        onClick={onClick}
      >
        {collapsed ? (
          <img
            src="/xebia-logo-collapsed.png" // Assumed smaller logo
            alt="Xebia Logo"
            width={42}
            height={42}
            className="object-contain mx-auto"
            style={{ width: "42px", height: "auto" }}
          />
        ) : (
          <img
            src="/xebia-logo.png"
            alt="Xebia Logo"
            width={120}
            height={36}
            className="object-contain"
            style={{ width: "120px", height: "auto" }}
          />
        )}
      </Link>
    </div>
  );
}
