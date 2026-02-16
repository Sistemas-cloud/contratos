"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, FileText, Edit, ArrowLeft, FileDown, ChevronDown } from "lucide-react";
import Link from "next/link";
import { generarPDF } from "@/lib/generators/pdf-generator";
import { generarDOCX } from "@/lib/generators/docx-generator";
import { formatearDias, formatearFechaLocal } from "@/lib/utils/formatters";

export default function ContratoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contrato, setContrato] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const fetchContrato = useCallback(async () => {
    try {
      setLoading(true);
      const contratoId = Array.isArray(params.id) ? params.id[0] : params.id;
      console.log("Buscando contrato con ID:", contratoId);

      const response = await fetch("/api/contratos?tipo=todos");
      const data = await response.json();

      // Si es error 401, redirigir al login
      if (!response.ok && response.status === 401) {
        toast.error(data.error || "Sesión expirada. Por favor, inicia sesión nuevamente.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      if (data.data) {
        const found = data.data.find((c: any) => c.id === contratoId);
        if (found) {
          console.log("Contrato encontrado:", found);
          setContrato(found);
          return;
        }
      }

      console.error("Contrato no encontrado con ID:", contratoId);
      toast.error("Contrato no encontrado");
      setTimeout(() => router.push("/contratos"), 2000);
    } catch (error: any) {
      console.error("Error al cargar contrato:", error);
      toast.error(error.message || "Error al cargar contrato");
      setTimeout(() => router.push("/contratos"), 2000);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchContrato();
  }, [fetchContrato]);

  const handleGeneratePDF = async () => {
    let toastId: string | number | undefined;
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      setGenerating(true);
      toastId = toast.loading("Generando PDF...");
      
      // Timeout de seguridad: cerrar el toast después de 30 segundos
      timeoutId = setTimeout(() => {
        if (toastId) {
          toast.dismiss(toastId);
          toast.error("La generación del PDF está tardando demasiado. Por favor, intenta de nuevo.");
        }
        setGenerating(false);
      }, 30000);
      
      // Generar PDF usando la librería (es síncrona pero puede tardar)
      generarPDF(contrato);
      
      // Esperar un poco para que se complete la descarga del archivo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Limpiar timeout si se completó exitosamente
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Cerrar el toast de loading específicamente
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
      
      toast.success("PDF generado y descargado correctamente");
    } catch (error: any) {
      // Limpiar timeout en caso de error
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Cerrar el toast de loading específicamente
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
      
      toast.error(error.message || "Error al generar PDF");
      console.error("Error generando PDF:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateDOCX = async () => {
    let toastId: string | number | undefined;
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      setGenerating(true);
      toastId = toast.loading("Generando documento Word...");
      
      // Timeout de seguridad: cerrar el toast después de 30 segundos
      timeoutId = setTimeout(() => {
        if (toastId) {
          toast.dismiss(toastId);
          toast.error("La generación del documento está tardando demasiado. Por favor, intenta de nuevo.");
        }
        setGenerating(false);
      }, 30000);
      
      // Generar DOCX usando la librería
      await generarDOCX(contrato);
      
      // Limpiar timeout si se completó exitosamente
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Cerrar el toast de loading específicamente
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
      
      toast.success("Documento Word generado y descargado correctamente");
    } catch (error: any) {
      // Limpiar timeout en caso de error
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Cerrar el toast de loading específicamente
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
      
      toast.error(error.message || "Error al generar documento Word");
      console.error("Error generando DOCX:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando contrato...</p>
        </div>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen animate-in fade-in duration-500">
        <div className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mb-6 animate-pulse">
          <FileText className="h-20 w-20 text-red-500" />
        </div>
        <p className="text-gray-700 text-lg font-medium mb-6">Contrato no encontrado</p>
        <Link href="/contratos">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Volver a Contratos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          <Link href="/contratos">
            <Button 
              variant="outline" 
              size="icon"
              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
              {contrato.nombre}
            </h1>
            <p className="text-gray-600 mt-1 text-lg font-medium">{contrato.puesto}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Button
              onClick={() => setDownloadOpen((prev) => !prev)}
              disabled={generating}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              Descargar
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            {downloadOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border-2 border-gray-200 bg-white shadow-xl z-10 animate-in fade-in slide-in-from-top-4 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setDownloadOpen(false);
                    handleGeneratePDF();
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 font-medium text-gray-700 hover:text-red-700 border-b border-gray-100"
                >
                  📄 Descargar PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDownloadOpen(false);
                    handleGenerateDOCX();
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 font-medium text-gray-700 hover:text-blue-700"
                >
                  📝 Descargar Word
                </button>
              </div>
            )}
          </div>
          <Link href={`/contratos/${contrato.id}/editar`}>
            <Button 
              variant="outline"
              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 hover:scale-105"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Nombre:</span> {contrato.nombre}
            </div>
            <div>
              <span className="font-medium">Puesto:</span> {contrato.puesto}
            </div>
            <div>
              <span className="font-medium">Nacionalidad:</span> {contrato.nacionalidad}
            </div>
            <div>
              <span className="font-medium">Edad:</span> {contrato.edad} años
            </div>
            <div>
              <span className="font-medium">Estado Civil:</span> {contrato.e_civil}
            </div>
            <div>
              <span className="font-medium">RFC:</span> {contrato.rfc}
            </div>
            <div>
              <span className="font-medium">CURP:</span> {contrato.curp}
            </div>
            <div>
              <span className="font-medium">Domicilio:</span> {contrato.domicilio}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos del Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Tipo:</span>{" "}
              {contrato.tipo === "determinado"
                ? "Tiempo Determinado"
                : contrato.tipo === "indeterminado"
                ? "Indeterminado"
                : "Por Hora"}
            </div>

            {/* Indeterminado: solo fecha_leido, fecha_inicio, fecha_contrato (según BD) */}
            {contrato.tipo === "indeterminado" && (
              <>
                <div>
                  <span className="font-medium">Fecha de contrato leído:</span>{" "}
                  {formatearFechaLocal(contrato.fecha_leido)}
                </div>
                <div>
                  <span className="font-medium">Fecha de inicio:</span>{" "}
                  {formatearFechaLocal(contrato.fecha_inicio)}
                </div>
                <div>
                  <span className="font-medium">Fecha de contrato (firma):</span>{" "}
                  {formatearFechaLocal(contrato.fecha_contrato)}
                </div>
                {contrato.salario != null && (
                  <div>
                    <span className="font-medium">Salario:</span> $
                    {parseFloat(String(contrato.salario)).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                )}
              </>
            )}

            {/* Determinado: solo fecha_contrato, fecha_termino (según BD) */}
            {contrato.tipo === "determinado" && (
              <>
                <div>
                  <span className="font-medium">Fecha de contrato:</span>{" "}
                  {formatearFechaLocal(contrato.fecha_contrato)}
                </div>
                <div>
                  <span className="font-medium">Fecha de término:</span>{" "}
                  {formatearFechaLocal(contrato.fecha_termino)}
                </div>
                {contrato.sueldo_mensual != null && (
                  <div>
                    <span className="font-medium">Sueldo mensual:</span> $
                    {parseFloat(String(contrato.sueldo_mensual)).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                )}
              </>
            )}

            {/* Por hora: solo fecha_inicio_esc, fecha_termino_esc, fecha_contrato (según BD) */}
            {contrato.tipo === "hora" && (
              <>
                <div>
                  <span className="font-medium">Fecha inicio (escolar):</span>{" "}
                  {formatearFechaLocal(contrato.fecha_inicio_esc)}
                </div>
                <div>
                  <span className="font-medium">Fecha término (escolar):</span>{" "}
                  {formatearFechaLocal(contrato.fecha_termino_esc)}
                </div>
                <div>
                  <span className="font-medium">Fecha de contrato:</span>{" "}
                  {formatearFechaLocal(contrato.fecha_contrato)}
                </div>
                {contrato.costo_hora != null && (
                  <div>
                    <span className="font-medium">Costo por hora:</span> $
                    {parseFloat(String(contrato.costo_hora)).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                )}
              </>
            )}
            {/* Fechas de registro guardadas en base de datos */}
            {(contrato.created_at || contrato.updated_at) && (
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Fechas de registro del contrato
                </div>
                {contrato.created_at && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Registrado:</span>{" "}
                    {formatearFechaLocal(contrato.created_at)}
                  </div>
                )}
                {contrato.updated_at && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Última actualización:</span>{" "}
                    {formatearFechaLocal(contrato.updated_at)}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horario y Días</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Días de trabajo:</span> {formatearDias(contrato.dias || "")}
            </div>
            <div>
              <span className="font-medium">Hora de entrada:</span> {contrato.hora_entrada}
            </div>
            <div>
              <span className="font-medium">Hora de salida:</span> {contrato.hora_salida}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{contrato.funciones}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beneficiarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="font-medium">Beneficiario 1</div>
              <div className="text-sm text-muted-foreground">
                {contrato.bene1} - {contrato.paren1} ({contrato.porc1}%)
              </div>
            </div>
            {contrato.bene2 && (
              <div>
                <div className="font-medium">Beneficiario 2</div>
                <div className="text-sm text-muted-foreground">
                  {contrato.bene2} - {contrato.paren2} ({contrato.porc2}%)
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testigos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Testigo 1:</span> {contrato.testigo1}
            </div>
            <div>
              <span className="font-medium">Testigo 2:</span> {contrato.testigo2}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
