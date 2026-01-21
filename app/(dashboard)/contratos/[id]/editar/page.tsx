"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { DIAS_SEMANA, ESTADOS_CIVILES, NACIONALIDADES } from "@/lib/constants";

export default function EditarContratoPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tipoContrato, setTipoContrato] = useState<string>("");
  const [formData, setFormData] = useState<any>({
    nombre: "",
    puesto: "",
    nacionalidad: "Mexicana",
    edad: "",
    e_civil: "",
    rfc: "",
    domicilio: "",
    curp: "",
    funciones: "",
    dias: [],
    hora_entrada: "",
    hora_salida: "",
    bene1: "",
    paren1: "",
    porc1: "",
    bene2: "",
    paren2: "",
    porc2: "",
    testigo1: "",
    testigo2: "",
    fecha_contrato: "",
    fecha_termino: "",
    sueldo_mensual: "",
    fecha_leido: "",
    fecha_inicio: "",
    salario: "",
    fecha_inicio_esc: "",
    fecha_termino_esc: "",
    costo_hora: "",
  });

  const fetchContrato = useCallback(async () => {
    try {
      setLoading(true);
      const contratoId = Array.isArray(params.id) ? params.id[0] : params.id;
      const tipos = ["determinado", "indeterminado", "hora"];
      
      for (const tipo of tipos) {
        const response = await fetch(`/api/contratos?tipo=${tipo}`);
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
            setTipoContrato(tipo);
            setFormData({
              ...found,
              dias: found.dias ? found.dias.split(",").map((d: string) => d.trim()) : [],
              edad: found.edad?.toString() || "",
              porc1: found.porc1?.toString() || "",
              porc2: found.porc2?.toString() || "",
              sueldo_mensual: found.sueldo_mensual?.toString() || "",
              salario: found.salario?.toString() || "",
              costo_hora: found.costo_hora?.toString() || "",
            });
            break;
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error al cargar contrato");
      router.push("/contratos");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchContrato();
  }, [fetchContrato]);

  const handleDiaChange = (dia: string) => {
    setFormData((prev: any) => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter((d: string) => d !== dia)
        : [...prev.dias, dia],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const porc1 = parseInt(formData.porc1) || 0;
      const porc2 = parseInt(formData.porc2) || 0;
      if (porc1 + porc2 !== 100) {
        toast.error("La suma de porcentajes debe ser 100%");
        setSaving(false);
        return;
      }

      // Preparar los datos para enviar
      const updateData: any = {
        tipo: tipoContrato,
        nombre: formData.nombre,
        puesto: formData.puesto,
        nacionalidad: formData.nacionalidad,
        edad: formData.edad,
        e_civil: formData.e_civil,
        rfc: formData.rfc,
        domicilio: formData.domicilio,
        curp: formData.curp,
        funciones: formData.funciones,
        dias: formData.dias,
        hora_entrada: formData.hora_entrada,
        hora_salida: formData.hora_salida,
        bene1: formData.bene1,
        paren1: formData.paren1,
        porc1: formData.porc1,
        bene2: formData.bene2 || null,
        paren2: formData.paren2 || null,
        porc2: formData.porc2 || null,
        testigo1: formData.testigo1,
        testigo2: formData.testigo2,
      };

      // Agregar campos específicos según el tipo de contrato
      if (tipoContrato === "determinado") {
        updateData.fecha_contrato = formData.fecha_contrato;
        updateData.fecha_termino = formData.fecha_termino;
        updateData.sueldo_mensual = formData.sueldo_mensual;
      } else if (tipoContrato === "indeterminado") {
        updateData.fecha_leido = formData.fecha_leido;
        updateData.fecha_inicio = formData.fecha_inicio;
        updateData.fecha_contrato = formData.fecha_contrato;
        updateData.salario = formData.salario;
      } else if (tipoContrato === "hora") {
        updateData.fecha_inicio_esc = formData.fecha_inicio_esc;
        updateData.fecha_termino_esc = formData.fecha_termino_esc;
        updateData.fecha_contrato = formData.fecha_contrato;
        updateData.costo_hora = formData.costo_hora;
      }

      const contratoId = Array.isArray(params.id) ? params.id[0] : params.id;
      const response = await fetch(`/api/contratos/${contratoId}?tipo=${tipoContrato}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
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
        throw new Error(data.error || "Error al actualizar contrato");
      }

      toast.success("Contrato actualizado exitosamente");
      router.push(`/contratos/${params.id}`);
      router.refresh();
    } catch (error: any) {
      console.error("Error al actualizar contrato:", error);
      toast.error(error.message || "Error al actualizar contrato");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/contratos/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Contrato</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={tipoContrato}
              disabled
              className="w-full px-4 py-2 border border-input rounded-lg bg-muted text-foreground cursor-not-allowed"
            >
              <option value="determinado">Tiempo de Prueba</option>
              <option value="indeterminado">Contrato Indeterminado</option>
              <option value="hora">Tiempo Determinado por Hora</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              El tipo de contrato no puede ser modificado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos del Trabajador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre del trabajador *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Puesto *</Label>
                <Input
                  value={formData.puesto}
                  onChange={(e) =>
                    setFormData({ ...formData, puesto: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Nacionalidad *</Label>
                <select
                  value={formData.nacionalidad}
                  onChange={(e) =>
                    setFormData({ ...formData, nacionalidad: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                >
                  {NACIONALIDADES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Edad *</Label>
                <Input
                  type="number"
                  min="18"
                  value={formData.edad}
                  onChange={(e) =>
                    setFormData({ ...formData, edad: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Estado Civil *</Label>
                <select
                  value={formData.e_civil}
                  onChange={(e) =>
                    setFormData({ ...formData, e_civil: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                >
                  <option value="">Seleccione</option>
                  {ESTADOS_CIVILES.map((ec) => (
                    <option key={ec} value={ec}>
                      {ec}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>RFC *</Label>
                <Input
                  value={formData.rfc}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9Ñ&]/g, '').slice(0, 13);
                    setFormData({ ...formData, rfc: value });
                  }}
                  placeholder="ABCD123456EF7"
                  maxLength={13}
                  pattern="[A-ZÑ&0-9]{12,13}"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.rfc.length}/13 caracteres
                </p>
              </div>
              <div>
                <Label>Domicilio *</Label>
                <Input
                  value={formData.domicilio}
                  onChange={(e) =>
                    setFormData({ ...formData, domicilio: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>CURP *</Label>
                <Input
                  value={formData.curp}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
                    setFormData({ ...formData, curp: value });
                  }}
                  placeholder="ABCD123456HABCDEF01"
                  maxLength={18}
                  pattern="[A-Z0-9]{18}"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.curp.length}/18 caracteres
                </p>
              </div>
            </div>
            <div>
              <Label>Funciones *</Label>
              <textarea
                value={formData.funciones}
                onChange={(e) =>
                  setFormData({ ...formData, funciones: e.target.value })
                }
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Campos específicos por tipo de contrato */}
        {tipoContrato === "determinado" && (
          <Card>
            <CardHeader>
              <CardTitle>Datos del Contrato Determinado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de contrato *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_contrato}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_contrato: e.target.value })
                    }
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Fecha de término *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_termino}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_termino: e.target.value })
                    }
                    min={formData.fecha_contrato || undefined}
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Sueldo mensual *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.sueldo_mensual}
                    onChange={(e) =>
                      setFormData({ ...formData, sueldo_mensual: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {tipoContrato === "indeterminado" && (
          <Card>
            <CardHeader>
              <CardTitle>Datos del Contrato Indeterminado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de lectura *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_leido}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_leido: e.target.value })
                    }
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Fecha de inicio *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_inicio: e.target.value })
                    }
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Fecha de contrato *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_contrato}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_contrato: e.target.value })
                    }
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Salario mensual *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.salario}
                    onChange={(e) =>
                      setFormData({ ...formData, salario: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {tipoContrato === "hora" && (
          <Card>
            <CardHeader>
              <CardTitle>Datos del Contrato por Hora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha inicio ciclo escolar *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_inicio_esc}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_inicio_esc: e.target.value })
                    }
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Fecha término ciclo escolar *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_termino_esc}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_termino_esc: e.target.value })
                    }
                    min={formData.fecha_inicio_esc || undefined}
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Fecha de contrato *</Label>
                  <Input
                    type="date"
                    value={formData.fecha_contrato}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_contrato: e.target.value })
                    }
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label>Costo por hora *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.costo_hora}
                    onChange={(e) =>
                      setFormData({ ...formData, costo_hora: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Horario y Días de Trabajo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hora de entrada *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="time"
                    value={formData.hora_entrada}
                    onChange={(e) =>
                      setFormData({ ...formData, hora_entrada: e.target.value })
                    }
                    className="pl-10 cursor-pointer"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Hora de salida *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="time"
                    value={formData.hora_salida}
                    onChange={(e) =>
                      setFormData({ ...formData, hora_salida: e.target.value })
                    }
                    className="pl-10 cursor-pointer"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Días de trabajo *</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {DIAS_SEMANA.slice(0, 6).map((dia) => (
                  <label key={dia} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.dias.includes(dia)}
                      onChange={() => handleDiaChange(dia)}
                      className="rounded"
                    />
                    <span>{dia}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beneficiarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Nombre completo 1 *</Label>
                <Input
                  value={formData.bene1}
                  onChange={(e) =>
                    setFormData({ ...formData, bene1: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Parentesco 1 *</Label>
                <Input
                  value={formData.paren1}
                  onChange={(e) =>
                    setFormData({ ...formData, paren1: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Porcentaje 1 *</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.porc1}
                  onChange={(e) =>
                    setFormData({ ...formData, porc1: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Nombre completo 2</Label>
                <Input
                  value={formData.bene2 || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bene2: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Parentesco 2</Label>
                <Input
                  value={formData.paren2 || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, paren2: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Porcentaje 2</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.porc2 || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, porc2: e.target.value })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              La suma de los porcentajes debe ser 100%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testigos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Testigo 1 *</Label>
                <Input
                  value={formData.testigo1}
                  onChange={(e) =>
                    setFormData({ ...formData, testigo1: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Testigo 2 *</Label>
                <Input
                  value={formData.testigo2}
                  onChange={(e) =>
                    setFormData({ ...formData, testigo2: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
          <Link href={`/contratos/${params.id}`}>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
