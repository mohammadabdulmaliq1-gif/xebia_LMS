
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useApiStatus } from "../../services/api";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isOffline = useApiStatus();

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
          isOffline={isOffline}
        />

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
