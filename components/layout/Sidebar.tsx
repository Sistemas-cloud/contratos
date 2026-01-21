"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, PlusCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/contratos/nuevo", label: "Nuevo Contrato", icon: PlusCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 shadow-sm">
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                "animate-in fade-in slide-in-from-left-4",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 scale-[1.02]"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-[1.01]"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 animate-pulse" />
              )}
              <Icon className={cn(
                "h-5 w-5 relative z-10 transition-transform duration-300",
                isActive ? "text-white scale-110" : "text-gray-600 group-hover:text-blue-600 group-hover:scale-110"
              )} />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
