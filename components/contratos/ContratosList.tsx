"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Contrato } from "@/lib/types/contrato";

export default function ContratosList() {
  const router = useRouter();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");

  const fetchContratos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contratos?tipo=${tipoFiltro}`);
      const data = await response.json();

      console.log("[ContratosList] Respuesta API:", { 
        ok: response.ok, 
        status: response.status,
        dataLength: data.data?.length || 0,
        data: data.data 
      });

      if (!response.ok) {
        // Si es error 401, redirigir al login
        if (response.status === 401) {
          toast.error(data.error || "Sesión expirada. Por favor, inicia sesión nuevamente.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }
        throw new Error(data.error || "Error al cargar contratos");
      }

      const contratosData = data.data || [];
      console.log("[ContratosList] Contratos recibidos:", contratosData.length);
      
      // Asegurar que los IDs sean strings
      const contratosFormateados = contratosData.map((c: any) => ({
        ...c,
        id: String(c.id || c.contrato_id || c.determinado_id || c.indeterminado_id || c.hora_id)
      }));
      
      setContratos(contratosFormateados);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar contratos");
    } finally {
      setLoading(false);
    }
  }, [tipoFiltro, router]);

  useEffect(() => {
    fetchContratos();
  }, [fetchContratos]);

  const handleDelete = async (id: string, tipo: string) => {
    if (!confirm("¿Estás seguro de eliminar este contrato?")) return;

    try {
      const response = await fetch(`/api/contratos/${id}?tipo=${tipo}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        // Si es error 401, redirigir al login
        if (response.status === 401) {
          toast.error(data.error || "Sesión expirada. Por favor, inicia sesión nuevamente.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }
        throw new Error(data.error || "Error al eliminar contrato");
      }

      toast.success("Contrato eliminado");
      fetchContratos();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar contrato");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando contratos...</div>;
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "determinado":
        return "from-emerald-500 to-teal-600";
      case "indeterminado":
        return "from-purple-500 to-pink-600";
      case "hora":
        return "from-amber-500 to-orange-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  const getTipoBgColor = (tipo: string) => {
    switch (tipo) {
      case "determinado":
        return "from-emerald-50 to-teal-50";
      case "indeterminado":
        return "from-purple-50 to-pink-50";
      case "hora":
        return "from-amber-50 to-orange-50";
      default:
        return "from-blue-50 to-indigo-50";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          <option value="todos">Todos los contratos</option>
          <option value="determinado">Tiempo Determinado</option>
          <option value="indeterminado">Indeterminado</option>
          <option value="hora">Por Hora</option>
        </select>
      </div>

      {contratos.length === 0 ? (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 animate-in fade-in duration-500">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center animate-pulse">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <p className="text-gray-600 text-lg mb-4">No hay contratos registrados</p>
            <Link href="/contratos/nuevo">
              <Button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Crear Primer Contrato
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contratos.map((contrato, index) => (
            <Card 
              key={contrato.id}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${getTipoBgColor(contrato.tipo)} animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                      {contrato.nombre}
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">{contrato.puesto}</p>
                  </div>
                  <div className={`p-2 bg-gradient-to-br ${getTipoColor(contrato.tipo)} rounded-lg shadow-md`}>
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">RFC:</span>
                    <span className="text-gray-600">{contrato.rfc}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTipoColor(contrato.tipo)} text-white shadow-sm`}>
                      {contrato.tipo === "determinado"
                        ? "Tiempo Determinado"
                        : contrato.tipo === "indeterminado"
                        ? "Indeterminado"
                        : "Por Hora"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link href={`/contratos/${contrato.id}`} className="flex-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </Link>
                  <Link
                    href={`/contratos/${contrato.id}/editar`}
                    className="flex-1"
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contrato.id, contrato.tipo)}
                    className="text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
