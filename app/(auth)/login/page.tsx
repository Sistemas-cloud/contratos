import LoginForm from "@/components/auth/LoginForm";
import Navbar from "@/components/layout/Navbar";
import { FileText } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      <Navbar />
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6 pt-24 relative z-10">
        <div className="w-full max-w-lg">
          {/* Card principal con sombra mejorada */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Bienvenido
                </h2>
              </div>
              <p className="text-center text-blue-100 text-sm">
                Sistema de Gestión de Contratos
              </p>
            </div>
            
            {/* Contenido del formulario */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Iniciar Sesión
                </h3>
                <p className="text-gray-500 text-sm">
                  Ingresa tus credenciales para acceder al sistema
                </p>
              </div>
              <LoginForm />
            </div>
            
            {/* Footer decorativo */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-center text-xs text-gray-500">
                © 2025 Sistema de Contratos. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
