"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useDataMode } from "../../services/api";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDemoMode, isFallback } = useDataMode();

  // Sync state with localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-collapsed");
      if (stored !== null) {
        setCollapsed(stored === "true");
      } else {
        // Tablet responsive check: collapse by default on tablet sizes (768px - 1024px)
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        setCollapsed(isTablet);
      }
    }
  }, []);

  const handleCollapseToggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar-collapsed", String(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background relative flex">
      {/* 1. Sidebar (Fixed left-side block) */}
      <Sidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onCollapseToggle={handleCollapseToggle}
      />

      {/* 2. Main content area (flows naturally next to the relative sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out min-h-screen">
        {/* Sticky top navbar */}
        <Navbar
          onMenuToggle={() => setMobileOpen(true)}
          collapsed={collapsed}
          onCollapseToggle={handleCollapseToggle}
          isOffline={isDemoMode}
        />

        {/* Warning notification banner if fallback occurs */}
        {isFallback && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 flex items-center gap-2.5 text-xs font-bold text-amber-800 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping flex-shrink-0" />
            <span>Spring Boot backend is currently offline. Falling back to local simulation data.</span>
          </div>
        )}

        {/* Scrollable pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
