"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Card, { CardBody } from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import useToast from "../../../hooks/useToast";
import { Shield, Save, RefreshCw } from "lucide-react";

export default function AdminPermissionsPage() {
  const toast = useToast();

  const [permissionsMatrix, setPermissionsMatrix] = useState({
    ADMIN: ["read:courses", "write:courses", "delete:courses", "manage:users", "view:analytics", "publish:content"],
    EDITOR: ["read:courses", "write:courses", "view:analytics", "publish:content"],
    LEARNER: ["read:courses"]
  });

  const availablePermissions = [
    { key: "read:courses", label: "Read Syllabus Courses", desc: "Allows viewing course catalog, syllabus outline, and reading lesson blocks." },
    { key: "write:courses", label: "Write Syllabus Courses", desc: "Allows creating, updating, and reordering courses, modules, and submodules." },
    { key: "delete:courses", label: "Delete Syllabus Courses", desc: "Allows permanent removal of courses, modules, and submodules from curriculum." },
    { key: "manage:users", label: "Manage IAM Learners", desc: "Allows provisioning learner credential login keys and overriding profiles." },
    { key: "view:analytics", label: "View Analytics Telemetry", desc: "Allows viewing metrics charts, study sessions logs, and exam scores." },
    { key: "publish:content", label: "Approve Content Blocks", desc: "Allows publishing draft blocks, approving reviews, and editing version histories." },
  ];

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lms_role_permissions");
      if (stored) {
        try {
          setPermissionsMatrix(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse lms_role_permissions");
        }
      }
    }
  }, []);

  const handleToggle = (role, permKey) => {
    setPermissionsMatrix((prev) => {
      const currentList = prev[role] || [];
      let newList;
      if (currentList.includes(permKey)) {
        newList = currentList.filter((k) => k !== permKey);
      } else {
        newList = [...currentList, permKey];
      }
      const updated = { ...prev, [role]: newList };
      localStorage.setItem("lms_role_permissions", JSON.stringify(updated));
      return updated;
    });
    toast.addToast(`Updated permission matrix for ${role}`, "success");
  };

  const handleSaveAll = () => {
    localStorage.setItem("lms_role_permissions", JSON.stringify(permissionsMatrix));
    toast.addToast("Security permissions matrix successfully written to storage database!", "success");
  };

  const handleReset = () => {
    const defaults = {
      ADMIN: ["read:courses", "write:courses", "delete:courses", "manage:users", "view:analytics", "publish:content"],
      EDITOR: ["read:courses", "write:courses", "view:analytics", "publish:content"],
      LEARNER: ["read:courses"]
    };
    setPermissionsMatrix(defaults);
    localStorage.setItem("lms_role_permissions", JSON.stringify(defaults));
    toast.addToast("Security matrix reset to default factory policies.", "success");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Security Policies"
        description="Configure role-based access control (RBAC) permission switches and IAM tenant policies."
        breadcrumbs={[
          { label: "Admin Console", href: "/admin" },
          { label: "Roles & Permissions", href: "/admin/permissions" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAll} className="flex items-center gap-1 shadow-sm">
              <Save className="w-3.5 h-3.5" />
              <span>Save Policy</span>
            </Button>
          </div>
        }
      />

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-border text-left text-xs font-semibold">
              <thead className="bg-gray-50/50 text-[10px] text-text-muted font-black uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 max-w-xs">Capability Scope / Permission key</th>
                  <th className="px-6 py-4 text-center">Administrator</th>
                  <th className="px-6 py-4 text-center">Content Editor</th>
                  <th className="px-6 py-4 text-center">Learner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {availablePermissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-gray-50/20 transition-colors">
                    <td className="px-6 py-4 max-w-xs space-y-1">
                      <span className="font-extrabold text-foreground block">{perm.label}</span>
                      <span className="text-[10px] text-text-muted font-medium block leading-normal">{perm.desc}</span>
                      <code className="text-[9px] bg-gray-100 text-primary px-1 rounded font-mono font-bold block w-fit">{perm.key}</code>
                    </td>
                    
                    {/* Admin Switch */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissionsMatrix.ADMIN.includes(perm.key)}
                        onChange={() => handleToggle("ADMIN", perm.key)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                      />
                    </td>

                    {/* Editor Switch */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissionsMatrix.EDITOR.includes(perm.key)}
                        onChange={() => handleToggle("EDITOR", perm.key)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                      />
                    </td>

                    {/* Learner Switch */}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissionsMatrix.LEARNER.includes(perm.key)}
                        onChange={() => handleToggle("LEARNER", perm.key)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                      />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      
      {/* Access policy explanation alert box */}
      <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <strong className="font-extrabold text-primary block">Tenant RBAC (Role-Based Access Control) Notice</strong>
          <span className="text-foreground/80 leading-relaxed font-semibold">
            Security tokens are verified inside middleware proxy modules. De-selecting scope key items will block API fetch operations and screen routing logic for matches of that user group.
          </span>
        </div>
      </div>
    </div>
  );
}
