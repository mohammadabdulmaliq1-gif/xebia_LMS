
import React from "react";
import { Link } from "react-router-dom";

export default function NavigationItem({
  name,
  href,
  icon: Icon,
  active,
  collapsed,
  onClick
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
        active
          ? "bg-primary text-white shadow-md shadow-primary/20"
          : "text-foreground hover:bg-gray-100 hover:text-primary"
      } ${collapsed ? "justify-center px-2" : ""}`}
      title={collapsed ? name : ""}
    >
      <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
      <span
        className={`truncate transition-all duration-300 overflow-hidden ${
          collapsed
            ? "max-w-0 opacity-0 pointer-events-none -translate-x-2"
            : "max-w-[200px] opacity-100 translate-x-0"
        }`}
      >
        {name}
      </span>
    </Link>
  );
}
