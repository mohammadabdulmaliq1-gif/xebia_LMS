import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, HelpCircle } from "lucide-react";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo and Icon */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/xebia-logo.png"
            alt="Xebia Logo"
            width={120}
            height={60}
            className="object-contain"
            style={{ width: "120px", height: "auto" }}
            priority
          />
          <h1 className="text-6xl font-black text-primary tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-foreground">Capability Route Not Found</h2>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            The educational track, module lesson, or layout page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Action triggers */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-3 flex flex-col">
          <Link href="/dashboard" className="w-full">
            <Button variant="primary" className="w-full justify-center gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          
          <Link href="/courses" className="w-full">
            <Button variant="outline" className="w-full justify-center gap-2">
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Technical Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-muted font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Xebia Academy Governance</span>
        </div>
      </div>
    </div>
  );
}
