"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function SidebarLogo({ collapsed, onClick }) {
  return (
    <div className={`transition-all duration-300 flex items-center justify-start flex-shrink-0 ${
      collapsed ? "p-3 justify-center" : "p-6"
    }`}>
      <Link href="/dashboard" className="flex items-center justify-start min-w-0" onClick={onClick}>
        {collapsed ? (
          <Image
            src="/xebia-logo.png"
            alt="Xebia Logo"
            width={42}
            height={42}
            className="w-10 h-auto object-contain mx-auto"
            priority
          />
        ) : (
          <Image
            src="/xebia-logo.png"
            alt="Xebia Logo"
            width={120}
            height={40}
            className="w-28 h-auto object-contain"
            priority
          />
        )}
      </Link>
    </div>
  );
}
