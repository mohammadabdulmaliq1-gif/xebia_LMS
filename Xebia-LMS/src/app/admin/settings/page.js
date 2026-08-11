"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Card, { CardBody } from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import useToast from "../../../hooks/useToast";
import { Save, Database, Palette, Settings, RotateCcw } from "lucide-react";
import { resetMockDatabase } from "../../../services/mockData";

export default function AdminSettingsPage() {
  const toast = useToast();

  const [tenantName, setTenantName] = useState("Xebia Academy Enterprise");
  const [themeAccent, setThemeAccent] = useState("primary");
  const [useMockAPI, setUseMockAPI] = useState(true);
  const [supportEmail, setSupportEmail] = useState("academy-support@xebia.com");

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTenantName(localStorage.getItem("lms_tenant_name") || "Xebia Academy Enterprise");
      setThemeAccent(localStorage.getItem("lms_theme_accent") || "primary");
      setUseMockAPI(localStorage.getItem("lms_use_mock_api") !== "false");
      setSupportEmail(localStorage.getItem("lms_support_email") || "academy-support@xebia.com");
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("lms_tenant_name", tenantName.trim());
    localStorage.setItem("lms_theme_accent", themeAccent);
    localStorage.setItem("lms_use_mock_api", String(useMockAPI));
    localStorage.setItem("lms_support_email", supportEmail.trim());
    
    toast.addToast("System configurations successfully saved!", "success");
  };

  const handleResetDatabase = () => {
    if (typeof window !== "undefined") {
      resetMockDatabase();
      toast.addToast("Workspace localStorage databases reset to default seed values!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Console System Settings"
        description="Configure tenant portal properties, branding color schemes, and system cache properties."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Settings", href: "/admin/settings" }
        ]}
      />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns: General & Brand Styling */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody className="p-6 space-y-4">
              <h3 className="text-sm font-black text-primary flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-border">
                <Settings className="w-4 h-4 text-accent" />
                <span>Portal Configuration</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Organization Tenant Name"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                />
                <Input
                  label="System Admin Support Email"
                  value={supportEmail}
                  type="email"
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Mock API Sandbox mode</label>
                <select
                  value={String(useMockAPI)}
                  onChange={(e) => setUseMockAPI(e.target.value === "true")}
                  className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50"
                >
                  <option value="true">Enable Standalone LocalStorage Sandbox (Recommended)</option>
                  <option value="false">Disable Sandbox (Connect Live Spring API endpoint)</option>
                </select>
                <span className="text-[10px] text-text-muted font-medium block">
                  Enables reading and writing state payloads to browser storage database when Spring boot service is un-reachable.
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6 space-y-4">
              <h3 className="text-sm font-black text-primary flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-border">
                <Palette className="w-4 h-4 text-accent" />
                <span>Branding Customization</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Portal Theme Accent Scheme</label>
                <select
                  value={themeAccent}
                  onChange={(e) => setThemeAccent(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-white rounded-xl text-sm focus:outline-none focus:border-primary/50"
                >
                  <option value="primary">Purple (Standard Xebia palette)</option>
                  <option value="indigo">Indigo (Enterprise Steel)</option>
                  <option value="emerald">Emerald (Modern Mint)</option>
                  <option value="rose">Coral Rose (Vibrant Warmth)</option>
                </select>
                <span className="text-[10px] text-text-muted font-medium block">
                  Selects the primary styling tokens applied globally inside layout headers.
                </span>
              </div>
            </CardBody>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button type="submit" variant="primary" className="flex items-center gap-1.5 shadow-sm">
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Database / Local Cache control */}
        <div className="space-y-6">
          <Card className="border-rose-100 bg-rose-50/10">
            <CardBody className="p-6 space-y-4">
              <h3 className="text-sm font-black text-rose-700 flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-rose-100">
                <Database className="w-4 h-4 text-rose-500" />
                <span>System Database Operations</span>
              </h3>

              <p className="text-xs text-text-muted leading-relaxed font-medium">
                Resetting the database wipes all categories, courses, submodules, content blocks, and user logins from localStorage, restoring default initial seed datasets.
              </p>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-center border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={handleResetDatabase}
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                <span>Reset Sandbox Database</span>
              </Button>
            </CardBody>
          </Card>
        </div>

      </form>
    </div>
  );
}
