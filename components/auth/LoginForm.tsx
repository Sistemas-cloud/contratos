"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, User, Lock, AlertCircle, Shield } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type?: string } | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Iniciando login con:", { username: formData.username });
      
      // Agregar timeout de 10 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // Usar URL relativa (Next.js maneja esto automáticamente)
      const apiUrl = '/api/auth/login';
      
      console.log("Haciendo fetch a:", apiUrl, "desde:", window.location.origin);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log("Respuesta recibida:", response.status, response.statusText);

      // Verificar si la respuesta es JSON válido
      let data;
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Respuesta no es JSON:", text);
        throw new Error("El servidor respondió con un formato inesperado");
      }

      try {
        data = await response.json();
        console.log("Datos parseados:", data);
      } catch (jsonError) {
        console.error("Error parseando JSON:", jsonError);
        throw new Error("Error al procesar la respuesta del servidor");
      }

      if (!response.ok) {
        // Mostrar error específico
        setError({
          message: data.error || "Error al iniciar sesión",
          type: data.errorType || "general"
        });
        
        // Mostrar toast con el error específico
        if (data.errorType === "username") {
          toast.error("Usuario no encontrado. Verifica tu nombre de usuario.");
        } else if (data.errorType === "password") {
          toast.error("Contraseña incorrecta. Verifica tu contraseña.");
        } else {
          toast.error(data.error || "Error al iniciar sesión");
        }
        return;
      }

      console.log("Login exitoso, redirigiendo...");
      toast.success("Sesión iniciada correctamente");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Login error completo:", error);
      let errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      
      if (error.name === 'AbortError') {
        errorMessage = "La solicitud tardó demasiado. Por favor, intenta de nuevo.";
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = "No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en http://localhost:3000";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError({
        message: errorMessage,
        type: "general"
      });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className={`p-4 rounded-xl text-sm border-l-4 shadow-sm animate-in slide-in-from-top-2 ${
          error.type === "username" 
            ? "bg-red-50 text-red-800 border-red-400" 
            : error.type === "password"
            ? "bg-orange-50 text-orange-800 border-orange-400"
            : "bg-red-50 text-red-800 border-red-400"
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
              error.type === "username" 
                ? "text-red-600" 
                : error.type === "password"
                ? "text-orange-600"
                : "text-red-600"
            }`} />
            <div className="flex-1">
              <div className="font-semibold mb-1">
                {error.type === "username" && "Usuario no encontrado"}
                {error.type === "password" && "Contraseña incorrecta"}
                {!error.type && "Error al iniciar sesión"}
              </div>
              <div className="text-sm opacity-90">{error.message}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-700 font-medium flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          Usuario
        </Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              setError(null);
            }}
            required
            disabled={loading}
            className={`pl-10 transition-all ${
              error?.type === "username" 
                ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-200" 
                : "focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {error?.type === "username" && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            El usuario ingresado no existe en el sistema
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setError(null);
            }}
            required
            disabled={loading}
            className={`pl-10 transition-all ${
              error?.type === "password" 
                ? "border-2 border-orange-500 focus:border-orange-500 focus:ring-orange-200" 
                : "focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {error?.type === "password" && (
          <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            La contraseña ingresada no coincide con el usuario
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
