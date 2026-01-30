"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Sesión cerrada");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-lg shadow-gray-900/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg shadow-blue-500/30">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Sistema de Contratos
          </h1>
        </div>
        {!isLoginPage && (
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            >
              <User className="h-4 w-4 mr-2" />
              Perfil
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
