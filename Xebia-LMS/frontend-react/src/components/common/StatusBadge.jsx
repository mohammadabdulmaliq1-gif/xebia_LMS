import React from "react";

export default function StatusBadge({ status }) {
  const normalized = (status || "").toString().trim().toUpperCase();
  
  // Custom styles strictly using the corporate palette colors
  const styles = {
    ACTIVE: "bg-[#01AC9F]/10 text-[#01AC9F] border-[#01AC9F]/20",
    COMPLETED: "bg-[#01AC9F]/10 text-[#01AC9F] border-[#01AC9F]/20",
    INACTIVE: "bg-[#DEDEDE]/20 text-[#5A5A5A] border-[#DEDEDE]",
    DRAFT: "bg-[#DEDEDE]/20 text-[#5A5A5A] border-[#DEDEDE]",
    PUBLISHED: "bg-[#84117C]/10 text-[#84117C] border-[#84117C]/20",
    PENDING: "bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/20",
    PENDING_APPROVAL: "bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/20",
    IN_PROGRESS: "bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/20",
    FEATURED: "bg-[#6C1D5F]/10 text-[#6C1D5F] border-[#6C1D5F]/20",
  };

  const style = styles[normalized] || "bg-[#DEDEDE]/20 text-[#5A5A5A] border-[#DEDEDE]";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${style}`}>
      {normalized.replace("_", " ")}
    </span>
  );
}
