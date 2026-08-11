"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "./DashboardLayout";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should NOT have the sidebar
  const noSidebarRoutes = ["/signin", "/"];

  if (noSidebarRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
